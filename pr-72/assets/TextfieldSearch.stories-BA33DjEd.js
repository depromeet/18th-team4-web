import{n as e,o as t}from"./chunk-BEldbCjX.js";import{H as n,_ as r}from"./iframe-PF7vemZJ.js";import{s as i,t as a}from"./components-D_1FcHMt.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{o=r(),s=t(n()),a(),{fn:c}=__STORYBOOK_MODULE_TEST__,l={title:`Common/Textfield/TextfieldSearch`,component:i,parameters:{layout:`centered`},tags:[`autodocs`],decorators:[e=>(0,o.jsx)(`div`,{className:`w-[32.7rem]`,children:(0,o.jsx)(e,{})})],args:{onSearch:c()}},u={name:`기본 (빈 상태)`},d=e=>{let[t,n]=(0,s.useState)(``);return(0,o.jsx)(i,{...e,value:t,onChange:e=>n(e.target.value)})},f={name:`입력 중`,render:e=>(0,o.jsx)(d,{...e})},p={name:`입력 완료`,args:{value:`입력 완료`}},m={name:`전체 상태 비교`,render:()=>(0,o.jsxs)(`div`,{className:`flex flex-col gap-[3.2rem] w-[32.7rem]`,children:[(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`p`,{className:`caption1-medium text-text-caption mb-[0.8rem]`,children:`빈 상태`}),(0,o.jsx)(i,{})]}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`p`,{className:`caption1-medium text-text-caption mb-[0.8rem]`,children:`입력 완료`}),(0,o.jsx)(i,{value:`입력 완료`})]})]})},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: '기본 (빈 상태)'
}`,...u.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: '입력 중',
  render: args => <WritingStory {...args} />
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: '입력 완료',
  args: {
    value: '입력 완료'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: '전체 상태 비교',
  render: () => <div className="flex flex-col gap-[3.2rem] w-[32.7rem]">
      <div>
        <p className="caption1-medium text-text-caption mb-[0.8rem]">빈 상태</p>
        <TextfieldSearch />
      </div>
      <div>
        <p className="caption1-medium text-text-caption mb-[0.8rem]">입력 완료</p>
        <TextfieldSearch value="입력 완료" />
      </div>
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Default`,`Writing`,`Filled`,`AllStates`]}))();export{m as AllStates,u as Default,p as Filled,f as Writing,h as __namedExportsOrder,l as default};