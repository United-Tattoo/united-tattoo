"use strict";(()=>{var e={};e.id=4282,e.ids=[4282],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},33569:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>j,patchFetch:()=>h,requestAsyncStorage:()=>x,routeModule:()=>O,serverHooks:()=>T,staticGenerationAsyncStorage:()=>g});var n={};r.r(n),r.d(n,{DELETE:()=>R,GET:()=>E,POST:()=>N,PUT:()=>_,dynamic:()=>m});var i=r(73278),s=r(45002),a=r(54877),o=r(71309),p=r(18445),u=r(33897),d=r(1035),l=r(29628);let m="force-dynamic",c=l.z.object({artistId:l.z.string().min(1),clientId:l.z.string().min(1),title:l.z.string().min(1),description:l.z.string().optional(),startTime:l.z.string().datetime(),endTime:l.z.string().datetime(),depositAmount:l.z.number().optional(),totalAmount:l.z.number().optional(),notes:l.z.string().optional()}),f=c.partial().extend({id:l.z.string().min(1),status:l.z.enum(["PENDING","CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED"]).optional()});async function E(e,{params:t}={},r){try{let t=await (0,p.getServerSession)(u.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:n}=new URL(e.url),i=n.get("start"),s=n.get("end"),a=n.get("artistId"),l=n.get("status"),m=(0,d.VK)(r?.env),c=`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE 1=1
    `,f=[];i&&(c+=" AND a.start_time >= ?",f.push(i)),s&&(c+=" AND a.end_time <= ?",f.push(s)),a&&(c+=" AND a.artist_id = ?",f.push(a)),l&&(c+=" AND a.status = ?",f.push(l)),c+=" ORDER BY a.start_time ASC";let E=m.prepare(c),N=await E.bind(...f).all();return o.NextResponse.json({appointments:N.results})}catch(e){return console.error("Error fetching appointments:",e),o.NextResponse.json({error:"Failed to fetch appointments"},{status:500})}}async function N(e,{params:t}={},r){try{let t=await (0,p.getServerSession)(u.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let n=await e.json(),i=c.parse(n),s=(0,d.VK)(r?.env),a=s.prepare(`
      SELECT id FROM appointments 
      WHERE artist_id = ? 
      AND status NOT IN ('CANCELLED', 'COMPLETED')
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `);if((await a.bind(i.artistId,i.startTime,i.startTime,i.endTime,i.endTime,i.startTime,i.endTime).all()).results.length>0)return o.NextResponse.json({error:"Time slot conflicts with existing appointment"},{status:409});let l=crypto.randomUUID(),m=s.prepare(`
      INSERT INTO appointments (
        id, artist_id, client_id, title, description, start_time, end_time,
        status, deposit_amount, total_amount, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);await m.bind(l,i.artistId,i.clientId,i.title,i.description||null,i.startTime,i.endTime,i.depositAmount||null,i.totalAmount||null,i.notes||null).run();let f=s.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE a.id = ?
    `),E=await f.bind(l).first();return o.NextResponse.json({appointment:E},{status:201})}catch(e){if(console.error("Error creating appointment:",e),e instanceof l.z.ZodError)return o.NextResponse.json({error:"Invalid appointment data",details:e.errors},{status:400});return o.NextResponse.json({error:"Failed to create appointment"},{status:500})}}async function _(e,{params:t}={},r){try{let t=await (0,p.getServerSession)(u.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let n=await e.json(),i=f.parse(n),s=(0,d.VK)(r?.env),a=s.prepare("SELECT * FROM appointments WHERE id = ?"),l=await a.bind(i.id).first();if(!l)return o.NextResponse.json({error:"Appointment not found"},{status:404});if(i.startTime||i.endTime){let e=i.startTime||l.start_time,t=i.endTime||l.end_time,r=i.artistId||l.artist_id,n=s.prepare(`
        SELECT id FROM appointments 
        WHERE artist_id = ? 
        AND id != ?
        AND status NOT IN ('CANCELLED', 'COMPLETED')
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
      `);if((await n.bind(r,i.id,e,e,t,t,e,t).all()).results.length>0)return o.NextResponse.json({error:"Time slot conflicts with existing appointment"},{status:409})}let m=[],c=[];if(Object.entries(i).forEach(([e,t])=>{if("id"!==e&&void 0!==t){let r=e.replace(/([A-Z])/g,"_$1").toLowerCase();m.push(`${r} = ?`),c.push(t)}}),0===m.length)return o.NextResponse.json({error:"No fields to update"},{status:400});m.push("updated_at = CURRENT_TIMESTAMP"),c.push(i.id);let E=s.prepare(`
      UPDATE appointments 
      SET ${m.join(", ")}
      WHERE id = ?
    `);await E.bind(...c).run();let N=s.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE a.id = ?
    `),_=await N.bind(i.id).first();return o.NextResponse.json({appointment:_})}catch(e){if(console.error("Error updating appointment:",e),e instanceof l.z.ZodError)return o.NextResponse.json({error:"Invalid appointment data",details:e.errors},{status:400});return o.NextResponse.json({error:"Failed to update appointment"},{status:500})}}async function R(e,{params:t}={},r){try{let t=await (0,p.getServerSession)(u.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:n}=new URL(e.url),i=n.get("id");if(!i)return o.NextResponse.json({error:"Appointment ID is required"},{status:400});let s=(0,d.VK)(r?.env).prepare("DELETE FROM appointments WHERE id = ?"),a=await s.bind(i).run(),l=a?.meta?.changes??a?.meta?.rows_written??0;if(0===l)return o.NextResponse.json({error:"Appointment not found"},{status:404});return o.NextResponse.json({success:!0})}catch(e){return console.error("Error deleting appointment:",e),o.NextResponse.json({error:"Failed to delete appointment"},{status:500})}}let O=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/appointments/route",pathname:"/api/appointments",filename:"route",bundlePath:"app/api/appointments/route"},resolvedPagePath:"/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo/app/api/appointments/route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:x,staticGenerationAsyncStorage:g,serverHooks:T}=O,j="/api/appointments/route";function h(){return(0,a.patchFetch)({serverHooks:T,staticGenerationAsyncStorage:g})}},32482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},18445:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});var n={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s.default}});var i=r(32482);Object.keys(i).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e))&&(e in t&&t[e]===i[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}}))});var s=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=a(void 0);if(r&&r.has(e))return r.get(e);var n={__proto__:null},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var o=i?Object.getOwnPropertyDescriptor(e,s):null;o&&(o.get||o.set)?Object.defineProperty(n,s,o):n[s]=e[s]}return n.default=e,r&&r.set(e,n),n}(r(4128));function a(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(a=function(e){return e?r:t})(e)}Object.keys(s).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e))&&(e in t&&t[e]===s[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return s[e]}}))})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[9379,8213,4128,4833,1253],()=>r(33569));module.exports=n})();