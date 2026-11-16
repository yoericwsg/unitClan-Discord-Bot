import React, {useEffect, useRef, useState} from 'react';
import {Dialog} from '@base-ui/react/dialog';
import {toast} from 'sonner';
import {
  ArrowUpRight, ArrowRight, Plus, X, Search, LayoutDashboard, Bot, Code2, Folder,
  Terminal, Sparkles, Settings, Shield, Users, Globe, ChevronDown, ChevronRight,
  Check, CheckCircle2, Lock, Play, Square, RotateCw, MoreHorizontal, FileCode2,
  Upload, Download, Copy, ExternalLink, Zap, Cpu, HardDrive, MemoryStick, Clock,
  Bell, Menu, Hash, Volume2, MessageSquare, Image, Ban, Flag, Trash2, Save,
  HelpCircle, BookOpen, Github, Command, Layers, Activity, Circle, CheckCheck
} from 'lucide-react';
export const h=React.createElement;
export const icons={arrow:ArrowRight,external:ArrowUpRight,plus:Plus,x:X,search:Search,dashboard:LayoutDashboard,bot:Bot,code:Code2,folder:Folder,terminal:Terminal,sparkles:Sparkles,settings:Settings,shield:Shield,users:Users,globe:Globe,down:ChevronDown,right:ChevronRight,check:Check,success:CheckCircle2,lock:Lock,play:Play,stop:Square,restart:RotateCw,more:MoreHorizontal,file:FileCode2,upload:Upload,download:Download,copy:Copy,link:ExternalLink,zap:Zap,cpu:Cpu,disk:HardDrive,ram:MemoryStick,clock:Clock,bell:Bell,menu:Menu,hash:Hash,volume:Volume2,chat:MessageSquare,image:Image,ban:Ban,flag:Flag,trash:Trash2,save:Save,help:HelpCircle,book:BookOpen,github:Github,command:Command,layers:Layers,activity:Activity,circle:Circle,checks:CheckCheck};
export function Icon({name,size=18,...props}) {return h(icons[name]||Circle,{size,strokeWidth:1.7,'aria-hidden':true,...props});}
export function Button({children,icon,end,variant='',className='',...props}) {
  return h('button',{type:'button',className:'button '+variant+' '+className,...props},icon&&h(Icon,{name:icon,size:16}),children,end&&h(Icon,{name:end,size:16}));
}
export function Badge({children,tone='muted'}){return h('span',{className:'badge '+tone},children);}
export function Brand({compact=false,onClick}) {return h('button',{type:'button',className:'brand',onClick,'aria-label':'Unit Host home'},h('img',{src:'./mark.svg',alt:'',width:30,height:30}),!compact&&h('span',null,'unit',h('b',null,'host')));}
export function Avatar({name='U',tone='mint',size=38,image}){return h('span',{className:'avatar '+tone,style:{width:size,height:size,fontSize:size*.36}},image?h('img',{src:image,alt:name}):name.slice(0,2).toUpperCase());}
export function Modal({open,onClose,title,description,children,wide=false}) {
  return h(Dialog.Root,{open,onOpenChange:o=>{if(!o)onClose();}},
    h(Dialog.Portal,null,h(Dialog.Backdrop,{className:'modal-backdrop'}),
      h(Dialog.Popup,{className:'modal '+(wide?'wide':'')},
        h('div',{className:'modal-head'},h('div',null,h(Dialog.Title,{className:'modal-title'},title),description&&h(Dialog.Description,{className:'muted'},description)),
          h(Dialog.Close,{className:'icon-button','aria-label':'Close dialog'},h(Icon,{name:'x'}))),
        children)));
}
export function Field({label,id,help,children}) {return h('div',{className:'field'},h('label',{htmlFor:id},label),children,help&&h('small',{className:'muted'},help));}
export function PageHead({eyebrow,title,subtitle,children}) {
  return h('div',{className:'page-head'},h('div',null,eyebrow&&h('div',{className:'eyebrow'},eyebrow),h('h1',null,title),subtitle&&h('p',{className:'muted'},subtitle)),h('div',{className:'head-actions'},children));
}
export function Empty({icon='lock',title,description,children}) {return h('div',{className:'empty'},h('div',{className:'empty-icon'},h(Icon,{name:icon,size:28})),h('h3',null,title),h('p',{className:'muted'},description),children);}
export function Note({children,tone='',icon='help'}) {return h('div',{className:'note '+tone},h(Icon,{name:icon,size:17}),h('div',null,children));}
export function backendToast(action) {toast.info(action+' needs a connected hosting backend.',{description:'This public static preview does not send Discord requests or run bot processes.'});}
export function textDownload(name,text,type='text/plain') {
  const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export async function copyText(text) {try{await navigator.clipboard.writeText(text);toast.success('Copied to clipboard');}catch{toast.error('Clipboard unavailable. Select and copy the text manually.');}}
export function CodeEditor({value,language,onChange}) {
  const parent=useRef(null),view=useRef(null),latest=useRef(onChange);
  const [error,setError]=useState(false);latest.current=onChange;
  useEffect(()=>{
    let active=true;
    Promise.all([
      import('https://esm.sh/codemirror@6.0.1?deps=@codemirror/state@6.5.2,@codemirror/view@6.38.6'),
      import('https://esm.sh/@codemirror/lang-javascript@6.2.3?deps=@codemirror/state@6.5.2,@codemirror/view@6.38.6'),
      import('https://esm.sh/@codemirror/lang-python@6.2.1?deps=@codemirror/state@6.5.2,@codemirror/view@6.38.6')
    ]).then(([cm,js,py])=>{
      if(!active||!parent.current)return;
      const theme=cm.EditorView.theme({
        '&':{backgroundColor:'#10141c',color:'#cad2e3',height:'100%',fontSize:'12px'},
        '.cm-content':{fontFamily:'JetBrains Mono, monospace',caretColor:'#a5f3bf',padding:'18px 0'},
        '.cm-line':{padding:'0 20px'},'.cm-gutters':{backgroundColor:'#10141c',color:'#59647a',border:'none'},
        '.cm-activeLineGutter':{backgroundColor:'#191f2b'},'.cm-activeLine':{backgroundColor:'#171d28'},
        '&.cm-focused .cm-cursor':{borderLeftColor:'#a5f3bf'},
        '&.cm-focused .cm-selectionBackground, .cm-selectionBackground':{backgroundColor:'#354540'},
        '.cm-scroller':{overflow:'auto'},'.cm-panels':{backgroundColor:'#202735',color:'#dce3ef'}
      },{dark:true});
      const extensions=[cm.basicSetup,theme,language==='python'?py.python():js.javascript(),cm.EditorView.updateListener.of(update=>{if(update.docChanged)latest.current(update.state.doc.toString());})];
      view.current=new cm.EditorView({doc:value,extensions,parent:parent.current});
    }).catch(()=>{if(active)setError(true);});
    return()=>{active=false;view.current?.destroy();view.current=null;};
  },[language]);
  useEffect(()=>{if(view.current&&view.current.state.doc.toString()!==value)view.current.dispatch({changes:{from:0,to:view.current.state.doc.length,insert:value}});},[value]);
  if(error)return h('textarea',{className:'editor-fallback','aria-label':'Code editor',spellCheck:false,value,onChange:e=>onChange(e.target.value)});
  return h('div',{className:'code-editor',ref:parent,'aria-label':'Code editor'});
}
