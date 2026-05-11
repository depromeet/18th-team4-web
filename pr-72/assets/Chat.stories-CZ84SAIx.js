import{n as e}from"./chunk-BEldbCjX.js";import{p as t,v as n}from"./Button-UB_3KWc4.js";import{a as r,i}from"./components-D_1FcHMt.js";var a,o,s,c,l;e((()=>{t(),r(),a={title:`Components/Chat`,component:i,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{user:{control:`radio`,options:[n.ME,n.AI]},message:{control:`text`}}},o={args:{user:n.ME,message:`오늘 읽은 책에서 인상 깊었던 부분을 알려줄게요.`}},s={args:{user:n.AI,message:`어떤 내용이 가장 인상 깊으셨나요?`}},c={args:{user:n.ME,message:`이 책은 정말 흥미로운 내용이 많았는데, 특히 3장에서 다룬 주제가 오늘 제 상황과 많이 닮아있어서 깊게 공감됐어요.`}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    user: CHAT_USER.ME,
    message: '오늘 읽은 책에서 인상 깊었던 부분을 알려줄게요.'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    user: CHAT_USER.AI,
    message: '어떤 내용이 가장 인상 깊으셨나요?'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    user: CHAT_USER.ME,
    message: '이 책은 정말 흥미로운 내용이 많았는데, 특히 3장에서 다룬 주제가 오늘 제 상황과 많이 닮아있어서 깊게 공감됐어요.'
  }
}`,...c.parameters?.docs?.source}}},l=[`Me`,`Ai`,`LongMessage`]}))();export{s as Ai,c as LongMessage,o as Me,l as __namedExportsOrder,a as default};