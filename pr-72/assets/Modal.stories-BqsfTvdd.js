import{n as e,o as t}from"./chunk-BEldbCjX.js";import{H as n,_ as r}from"./iframe-PF7vemZJ.js";import{n as i,r as a}from"./components-D_1FcHMt.js";var o,s,c,l,u,d,f,p;e((()=>{o=r(),s=t(n()),a(),c={title:`Components/Chat/Modal`,component:i,parameters:{layout:`fullscreen`},tags:[`autodocs`],argTypes:{isOpen:{control:`boolean`},onCancel:{action:`cancelled`},onConfirm:{action:`confirmed`}}},l={args:{isOpen:!0,onCancel:()=>{},onConfirm:()=>{}}},u={args:{isOpen:!1,onCancel:()=>{},onConfirm:()=>{}}},d=()=>{let[e,t]=(0,s.useState)(!1);return(0,o.jsxs)(`div`,{className:`flex items-center justify-center h-screen bg-gray-100`,children:[(0,o.jsx)(`button`,{className:`px-6 py-3 bg-black text-white rounded-[1.6rem] text-sm font-medium`,onClick:()=>t(!0),children:`대화 마무리`}),(0,o.jsx)(i,{isOpen:e,onCancel:()=>t(!1),onConfirm:()=>{alert(`확인!`),t(!1)}})]})},f={args:{isOpen:!1,onCancel:()=>{},onConfirm:()=>{}},render:()=>(0,o.jsx)(d,{})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    onCancel: () => {},
    onConfirm: () => {}
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: false,
    onCancel: () => {},
    onConfirm: () => {}
  }
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: false,
    onCancel: () => {},
    onConfirm: () => {}
  },
  render: () => <InteractiveTemplate />
}`,...f.parameters?.docs?.source}}},p=[`Open`,`Closed`,`Interactive`]}))();export{u as Closed,f as Interactive,l as Open,p as __namedExportsOrder,c as default};