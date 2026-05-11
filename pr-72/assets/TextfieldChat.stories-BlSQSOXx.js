import{n as e,o as t}from"./chunk-BEldbCjX.js";import{H as n,_ as r}from"./iframe-PF7vemZJ.js";import{g as i,h as a,m as o,p as s}from"./Button-UB_3KWc4.js";import{c,t as l}from"./components-D_1FcHMt.js";var u,d,f,p,m,h,g,_,v,y,b,x,S;e((()=>{u=r(),d=t(n()),l(),s(),{fn:f}=__STORYBOOK_MODULE_TEST__,p={title:`Common/Textfield/TextfieldChat`,component:c,parameters:{layout:`centered`},tags:[`autodocs`],decorators:[e=>(0,u.jsx)(`div`,{className:`w-[32.7rem]`,children:(0,u.jsx)(e,{})})],argTypes:{status:{control:`select`,options:Object.values(i),description:`default: 기본 | disabled: 비활성 | error: 오류`},bgVariant:{control:`select`,options:Object.values(o),description:`gray: 회색 배경 | white: 흰색 배경 + 그림자`},placeholder:{control:`text`}},args:{onSend:f()}},m={name:`기본 (default)`,args:{status:i.DEFAULT,bgVariant:o.GRAY,placeholder:a[i.DEFAULT]}},h=e=>{let[t,n]=(0,d.useState)(``);return(0,u.jsx)(c,{...e,status:i.DEFAULT,value:t,onChange:e=>n(e.target.value)})},g={name:`입력 중`,render:e=>(0,u.jsx)(h,{...e}),args:{bgVariant:o.GRAY,placeholder:a[i.DEFAULT]}},_={name:`입력 완료`,args:{status:i.DEFAULT,bgVariant:o.GRAY,defaultValue:`입력완료`}},v={name:`disabled (연결을 확인해주세요)`,args:{status:i.DISABLED,bgVariant:o.GRAY,placeholder:a[i.DISABLED]}},y={name:`error (잘못된 연결)`,args:{status:i.ERROR,bgVariant:o.GRAY,placeholder:a[i.ERROR]}},b={name:`흰색 배경`,args:{status:i.DEFAULT,bgVariant:o.WHITE,placeholder:a[i.DEFAULT]}},x={name:`전체 상태 비교`,render:()=>(0,u.jsxs)(`div`,{className:`flex gap-[1.6rem] w-[70rem]`,children:[(0,u.jsxs)(`div`,{className:`flex flex-col gap-[1.6rem] w-[32.7rem]`,children:[(0,u.jsx)(`p`,{className:`caption1-medium text-text-caption`,children:`gray 배경`}),(0,u.jsx)(c,{status:i.DEFAULT,bgVariant:o.GRAY,placeholder:a[i.DEFAULT]}),(0,u.jsx)(c,{status:i.DEFAULT,bgVariant:o.GRAY,defaultValue:`입력완료`}),(0,u.jsx)(c,{status:i.DISABLED,bgVariant:o.GRAY,placeholder:a[i.DISABLED]}),(0,u.jsx)(c,{status:i.ERROR,bgVariant:o.GRAY,placeholder:a[i.ERROR]})]}),(0,u.jsxs)(`div`,{className:`flex flex-col gap-[1.6rem] w-[32.7rem]`,children:[(0,u.jsx)(`p`,{className:`caption1-medium text-text-caption mt-[0.8rem]`,children:`white 배경`}),(0,u.jsx)(c,{status:i.DEFAULT,bgVariant:o.WHITE,placeholder:a[i.DEFAULT]}),(0,u.jsx)(c,{status:i.DEFAULT,bgVariant:o.WHITE,defaultValue:`입력완료`}),(0,u.jsx)(c,{status:i.DISABLED,bgVariant:o.WHITE,placeholder:a[i.DISABLED]}),(0,u.jsx)(c,{status:i.ERROR,bgVariant:o.WHITE,placeholder:a[i.ERROR]})]})]})},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: '기본 (default)',
  args: {
    status: CHAT_STATUS.DEFAULT,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT]
  }
}`,...m.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: '입력 중',
  render: args => <WritingStory {...args} />,
  args: {
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT]
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: '입력 완료',
  args: {
    status: CHAT_STATUS.DEFAULT,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    defaultValue: '입력완료'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'disabled (연결을 확인해주세요)',
  args: {
    status: CHAT_STATUS.DISABLED,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DISABLED]
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: 'error (잘못된 연결)',
  args: {
    status: CHAT_STATUS.ERROR,
    bgVariant: CHAT_BG_VARIANT.GRAY,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.ERROR]
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  name: '흰색 배경',
  args: {
    status: CHAT_STATUS.DEFAULT,
    bgVariant: CHAT_BG_VARIANT.WHITE,
    placeholder: CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT]
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: '전체 상태 비교',
  render: () => <div className="flex gap-[1.6rem] w-[70rem]">
      <div className="flex flex-col gap-[1.6rem] w-[32.7rem]">
        <p className="caption1-medium text-text-caption">gray 배경</p>
        <TextfieldChat status={CHAT_STATUS.DEFAULT} bgVariant={CHAT_BG_VARIANT.GRAY} placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT]} />
        <TextfieldChat status={CHAT_STATUS.DEFAULT} bgVariant={CHAT_BG_VARIANT.GRAY} defaultValue="입력완료" />
        <TextfieldChat status={CHAT_STATUS.DISABLED} bgVariant={CHAT_BG_VARIANT.GRAY} placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DISABLED]} />
        <TextfieldChat status={CHAT_STATUS.ERROR} bgVariant={CHAT_BG_VARIANT.GRAY} placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.ERROR]} />
      </div>
      <div className="flex flex-col gap-[1.6rem] w-[32.7rem]">
        <p className="caption1-medium text-text-caption mt-[0.8rem]">white 배경</p>
        <TextfieldChat status={CHAT_STATUS.DEFAULT} bgVariant={CHAT_BG_VARIANT.WHITE} placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DEFAULT]} />
        <TextfieldChat status={CHAT_STATUS.DEFAULT} bgVariant={CHAT_BG_VARIANT.WHITE} defaultValue="입력완료" />
        <TextfieldChat status={CHAT_STATUS.DISABLED} bgVariant={CHAT_BG_VARIANT.WHITE} placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.DISABLED]} />
        <TextfieldChat status={CHAT_STATUS.ERROR} bgVariant={CHAT_BG_VARIANT.WHITE} placeholder={CHAT_PLACEHOLDER[CHAT_STATUS.ERROR]} />
      </div>
    </div>
}`,...x.parameters?.docs?.source}}},S=[`Default`,`Writing`,`Done`,`Disabled`,`Error`,`WhiteBackground`,`AllStates`]}))();export{x as AllStates,m as Default,v as Disabled,_ as Done,y as Error,b as WhiteBackground,g as Writing,S as __namedExportsOrder,p as default};