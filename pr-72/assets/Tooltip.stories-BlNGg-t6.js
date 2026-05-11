import{n as e}from"./chunk-BEldbCjX.js";import{_ as t}from"./iframe-PF7vemZJ.js";import{o as n,t as r}from"./components-D_1FcHMt.js";var i,a,o,s,c,l;e((()=>{i=t(),r(),a={title:`Common/Tooltip`,component:n,parameters:{layout:`centered`},tags:[`autodocs`],args:{content:`이제 대화를 요약할 수 있어요`},argTypes:{arrowAlignment:{control:`radio`,options:[`left`,`middle`,`right`]},arrowSide:{control:`radio`,options:[`top`,`bottom`]}}},o={},s={args:{content:`아직 대화를 요약할 수 없어요. 대화를 더 진행한 후 요약을 진행할 수 있어요`}},c={render:()=>(0,i.jsxs)(`div`,{className:`relative inline-flex`,children:[(0,i.jsx)(`button`,{"aria-describedby":`coachmark-tooltip`,className:`body2-bold rounded-[0.625rem] bg-primary-base px-3 py-[0.63rem] text-gray-900`,type:`button`,children:`대화 요약`}),(0,i.jsx)(`div`,{className:`absolute top-full left-1/2 mt-2 -translate-x-1/2`,children:(0,i.jsx)(n,{arrowAlignment:`middle`,content:`이제 대화를 요약할 수 있어요`,id:`coachmark-tooltip`})})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    content: '아직 대화를 요약할 수 없어요. 대화를 더 진행한 후 요약을 진행할 수 있어요'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="relative inline-flex">
      <button aria-describedby="coachmark-tooltip" className="body2-bold rounded-[0.625rem] bg-primary-base px-3 py-[0.63rem] text-gray-900" type="button">
        대화 요약
      </button>
      <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
        <Tooltip arrowAlignment="middle" content="이제 대화를 요약할 수 있어요" id="coachmark-tooltip" />
      </div>
    </div>
}`,...c.parameters?.docs?.source}}},l=[`Default`,`LongContent`,`Coachmark`]}))();export{c as Coachmark,o as Default,s as LongContent,l as __namedExportsOrder,a as default};