import{printGeneratorConfig as j}from"@prisma/engine-core";var F=(n,r)=>({default:e=>{if(r==="enum")return`@default(${e})`;if(n==="Boolean")return`@default(${e})`;if(typeof e>"u"||e===null)return"";if(typeof e=="object")return`@default(${e.name}(${e.args}))`;if(typeof e=="number")return`@default(${e})`;if(typeof e=="string")return`@default("${e}")`;throw new Error(`Unsupported field attribute ${e}`)},isId:e=>e?"@id":"",isUnique:e=>e?"@unique":"",dbNames:e=>{},dbName:e=>e?`@map("${e}")`:"",native:e=>e?`${e}`:"",relationToFields:e=>{},relationOnDelete:e=>{},hasDefaultValue:e=>{},relationName:e=>{},documentation:e=>{},isReadOnly:e=>{},isGenerated:e=>{},isUpdatedAt:e=>e?"@updatedAt":"",columnName:e=>e?`@map("${e}")`:"",comment:e=>e?`//${e}`:""});function p(n,r,e){let{relationFromFields:t,relationToFields:i,relationName:o}=n;return r==="scalar"?`${Object.keys(n).map(s=>F(e,r)[s](n[s])).join(" ")}`:r==="object"&&t?t.length>0?`@relation(name: "${o}", fields: [${t}], references: [${i}])`:`@relation(name: "${o}") ${n!=null&&n.comment?"//"+n.comment:""}`:r==="enum"?`${Object.keys(n).map(s=>F(e,r)[s](n[s])).join(" ")}`:""}function w(n){return n.map(r=>{let{name:e,kind:t,type:i,isRequired:o,isList:s,...a}=r;if(t==="scalar")return`  ${e} ${i}${s?"[]":o?"":"?"} ${p(a,t,i)}`;if(t==="object")return`  ${e} ${i}${s?"[]":o?"":"?"} ${p(a,t,i)}`;if(t==="enum")return`  ${e} ${i}${s?"[]":o?"":"?"} ${p(a,t,i)}`;if(t==="comment")return`//${e}`;throw new Error(`Unsupported field kind "${t}"`)}).join(`
`)}function z(n){return n&&n.length>0?`@@id([${n.join(", ")}])`:""}function C(n){return n.length>0?n.map(r=>`@@unique([${r.join(", ")}])`).join(`
`):""}function D(n){return n?`@@map("${n}")`:""}function N(n){return`url = ${n.fromEnvVar?`env("${n.fromEnvVar}")`:n.value}`}function O(n){return`provider = "${n}"`}function U(n){let{name:r,uniqueFields:e,dbName:t,idFields:i,index:o}=n,s=n.fields;return`
model ${r} {
${w(s)}
${C(e)}
${D(t)}
${z(i)}
${o||""}
}`}function q(n){let{activeProvider:r,name:e,url:t}=n;return`
datasource ${e} {
	${O(r)}
	${N(t)}
}`}function v({name:n,values:r,dbName:e}){let t=r.map(({name:i,dbName:o})=>{let s=i;return i!==o&&o&&(s+=`@map("${o}")`),s});return`
enum ${n} {
	${t.join(`
	`)}
	${D(e||null)}
}`}async function h(n){return n.map(r=>U(r)).join(`
`)}async function M(n){return n.map(r=>q(r)).join(`
`)}async function x(n){return n.map(r=>j(r)).join(`
`)}async function b(n){return n.map(r=>v(r)).join(`
`)}import{formatSchema as A}from"@prisma/internals";var K=async({dmmf:{models:n,enums:r},config:{datasources:e,generators:t}})=>{let i=[await M(e),await x(t),await h(n),await b(r)].filter(o=>o).join(`


`);return await A({schema:i})};import{getConfig as S,getDMMF as T}from"@prisma/internals";import G from"strip-ansi";var I=(e=>(e[e.Prisma=0]="Prisma",e[e.Other=1]="Other",e))(I||{}),Q=async n=>{try{let{datamodel:r}=await T({datamodel:n}),e=await S({datamodel:n,ignoreEnvVarErrors:!0}),t=n.split(`
`),i="";return t.forEach((o,s)=>{if(o.includes("model")&&(i=o.trim().split(" ")[1]),o.includes("@db")){let a=o.trim().split(" "),l=a[0],m=a[2],c=r.models.find(u=>u.name===i),d=c==null?void 0:c.fields.find(u=>u.name===l);d&&(d.native=m)}if(o.includes("//")){let a=r.models.find(d=>d.name===i),l=o.trim().split(" "),m=o.trim().split("//")[1];if(l[0].includes("//")){let f=t[s-1].trim().split(" ")[0];if(f==="model")a==null||a.fields.unshift({kind:"comment",name:m});else{let y=a==null?void 0:a.fields.findIndex(E=>E.name===f);y&&(a==null||a.fields.splice(y+1,0,{kind:"comment",name:m}))}}else{let d=l[0],u=a==null?void 0:a.fields.find(f=>f.name===d);u&&(u.comment=m)}}if(o.includes("@@index")){let a=o.trim(),l=r.models.find(m=>m.name===i);l&&(l.index=a)}}),{datamodel:r,config:e}}catch(r){let e=G(r.message),t,i;return e.includes("error: ")?(t=R(e),i=0):(console.error(r),t=[{reason:e,row:"0"}],i=1),{errors:t,type:i}}},L=/^(?:Error validating.*?:)?(.+?)\n  -->  schema\.prisma:(\d+)\n/,R=n=>n.split("error: ").slice(1).map(r=>r.match(L).slice(1)).map(([r,e])=>({reason:r,row:e}));export*from"@prisma/generator-helper";import{}from"@prisma/internals";export{I as ErrorTypes,K as dmmfToSchema,Q as schemaToDmmf};
//# sourceMappingURL=index.mjs.map