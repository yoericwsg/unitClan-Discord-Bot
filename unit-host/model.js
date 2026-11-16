export const PLAN = Object.freeze({memoryGB:10,cpuPercent:100,storageGB:10,deployments:3,renewalMonths:3});
export function nextRenewal(date=new Date()) {
  const target=new Date(date);const day=target.getUTCDate();target.setUTCDate(1);
  target.setUTCMonth(target.getUTCMonth()+3);
  const last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();
  target.setUTCDate(Math.min(day,last));return target.toISOString();
}
export function detectRuntime(files) {
  const names=Object.keys(files);const node=names.some(n=>/(^|\/)package\.json$|\.(mjs|cjs|js|ts)$/.test(n));
  const python=names.some(n=>/(^|\/)(requirements\.txt|pyproject\.toml)$|\.py$/.test(n));
  return node&&python?'mixed':node?'node':python?'python':'unknown';
}
export function safeFileName(name) {
  return typeof name==='string'&&name.length<=140&&!name.startsWith('/')&&!name.includes('\\')&&!name.split('/').some(p=>p==='..'||p==='.'||!p)&&/^[\w./-]+$/.test(name)&&!/(^|\/)\.env($|\.)/i.test(name);
}
export function permissionsFor(bits) {
  const n=BigInt(bits||0);const has=b=>Boolean(n&8n)||Boolean(n&b);
  return {view:has(1024n),send:has(2048n),ban:has(4n),roles:has(268435456n)};
}
export const TEMPLATES=[
 {id:'starter-node',name:'Discord starter',language:'node',category:'Starter',description:'A minimal discord.js bot with /ping and a clean event layout.',features:['Slash commands','Environment token','Node.js'],icon:'bot'},
 {id:'moderation-node',name:'Moderation toolkit',language:'node',category:'Community',description:'A permission-aware /ban command with role hierarchy checks.',features:['Ban command','Permission checks','Node.js'],icon:'shield'},
 {id:'starter-python',name:'Python companion',language:'python',category:'Starter',description:'A small discord.py bot with synced application commands.',features:['Slash commands','discord.py','Python'],icon:'code'},
 {id:'welcome-python',name:'Welcome desk',language:'python',category:'Community',description:'A configurable welcome message for your newest members.',features:['Join events','Channel setup','Python'],icon:'users'}
];
export function templateFiles(id) {
  const python=id.includes('python');
  if(python) {
    const welcome=id==='welcome-python';
    return {
      'main.py': 'import os\nimport discord\nfrom discord import app_commands\n\nintents = discord.Intents.default()\n'+(welcome?'intents.members = True\n':'')+'\nclass Bot(discord.Client):\n    def __init__(self):\n        super().__init__(intents=intents)\n        self.tree = app_commands.CommandTree(self)\n\n    async def setup_hook(self):\n        await self.tree.sync()\n\nbot = Bot()\n\n@bot.tree.command(name="ping", description="Check whether the bot is responding")\nasync def ping(interaction: discord.Interaction):\n    await interaction.response.send_message(f"Pong! {round(bot.latency * 1000)} ms")\n'+(welcome?'\n@bot.event\nasync def on_member_join(member):\n    channel_id = os.getenv("WELCOME_CHANNEL_ID")\n    channel = member.guild.get_channel(int(channel_id)) if channel_id else None\n    if channel and channel.permissions_for(member.guild.me).send_messages:\n        await channel.send(f"Welcome, {member.mention}!", allowed_mentions=discord.AllowedMentions(users=True))\n':'')+'\n@bot.event\nasync def on_ready():\n    print(f"Connected as {bot.user}")\n\nbot.run(os.environ["DISCORD_TOKEN"])\n',
      'requirements.txt':'discord.py>=2.4,<3\n',
      'README.md':'# Discord Python starter\n\nInstall: pip install -r requirements.txt\nSet DISCORD_TOKEN on your compute server, then run python main.py.\n'+(welcome?'Set WELCOME_CHANNEL_ID. Enable Server Members Intent in the Developer Portal.\n':'')+'Never commit credentials. This template is generated in the static preview and has not been executed here.\n',
      '.gitignore':'.env\n.venv/\n__pycache__/\n'
    };
  }
  const mod=id==='moderation-node';
  return {
    'index.js':'import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";\n\nconst client = new Client({ intents: [GatewayIntentBits.Guilds] });\nconst commands = [new SlashCommandBuilder().setName("ping").setDescription("Check bot latency")'+(mod?', new SlashCommandBuilder().setName("ban").setDescription("Ban a member").setDefaultMemberPermissions(PermissionFlagsBits.BanMembers).addUserOption(o => o.setName("member").setDescription("Member to ban").setRequired(true))':'')+'];\n\nclient.once("ready", async () => {\n  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);\n  await rest.put(Routes.applicationCommands(client.user.id), { body: commands.map(c => c.toJSON()) });\n  console.log("Connected as " + client.user.tag);\n});\n\nclient.on("interactionCreate", async interaction => {\n  if (!interaction.isChatInputCommand()) return;\n  if (interaction.commandName === "ping") return interaction.reply("Pong! " + client.ws.ping + " ms");\n'+(mod?'  if (interaction.commandName === "ban") {\n    if (!interaction.inGuild() || !interaction.memberPermissions?.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: "Ban permission required.", ephemeral: true });\n    await interaction.deferReply({ ephemeral: true });\n    try {\n      const member = await interaction.guild.members.fetch(interaction.options.getUser("member", true).id);\n      const requester = await interaction.guild.members.fetch(interaction.user.id);\n      if (member.id === interaction.user.id || member.id === interaction.guild.ownerId) return interaction.editReply("You cannot ban yourself or the server owner.");\n      if (requester.id !== interaction.guild.ownerId && requester.roles.highest.comparePositionTo(member.roles.highest) <= 0) return interaction.editReply("Your role must be above the target member.");\n      if (!member.bannable) return interaction.editReply("The bot role hierarchy prevents this ban.");\n      await member.ban({ reason: "Requested by " + interaction.user.id });\n      await interaction.editReply("Member banned.");\n    } catch (error) { console.error(error); await interaction.editReply("Ban failed. Check permissions and role hierarchy."); }\n  }\n':'')+'});\n\nclient.on("error", console.error);\nclient.login(process.env.DISCORD_TOKEN);\n',
    'package.json':JSON.stringify({name:mod?'moderation-bot':'discord-starter',private:true,type:'module',scripts:{start:'node index.js'},dependencies:{'discord.js':'^14.19.3'},engines:{node:'>=22'}},null,2)+'\n',
    'README.md':'# Discord Node.js starter\n\nInstall: npm install\nSet DISCORD_TOKEN on your compute server, then run npm start.\nGrant only the permissions your bot needs. Never commit credentials.\nThis template is generated in the static preview and has not been executed here.\n',
    '.gitignore':'.env\nnode_modules/\n'
  };
}
export function initialProjects() {
  return [
    {id:'community',name:'community-bot',runtime:'node',kind:'Discord bot',template:'starter-node',status:'Prepared',color:'mint',files:templateFiles('starter-node'),logs:['[preview] Project files prepared.','[preview] Runtime detected: Node.js.','[preview] No compute server connected. Bot has not been started.']},
    {id:'companion',name:'python-companion',runtime:'python',kind:'Discord bot',template:'starter-python',status:'Prepared',color:'lavender',files:templateFiles('starter-python'),logs:['[preview] Python starter created.','[preview] requirements.txt detected.','[preview] Waiting for a compute server.']}
  ];
}
export function fileBytes(files) {return new TextEncoder().encode(Object.values(files).join('')).length;}
