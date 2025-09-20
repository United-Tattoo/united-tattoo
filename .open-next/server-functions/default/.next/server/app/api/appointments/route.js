"use strict";(()=>{var e={};e.id=4282,e.ids=[4282],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},33569:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>L,patchFetch:()=>h,requestAsyncStorage:()=>D,routeModule:()=>T,serverHooks:()=>x,staticGenerationAsyncStorage:()=>g});var n={};r.r(n),r.d(n,{DELETE:()=>A,GET:()=>N,POST:()=>O,PUT:()=>R,dynamic:()=>m});var i=r(73278),s=r(45002),a=r(54877),o=r(71309),u=r(18445),p=r(33897),d=r(1035),l=r(93470),c=r(29628);let m="force-dynamic",E=c.z.object({artistId:c.z.string().min(1),clientId:c.z.string().min(1),title:c.z.string().min(1),description:c.z.string().optional(),startTime:c.z.string().datetime(),endTime:c.z.string().datetime(),depositAmount:c.z.number().optional(),totalAmount:c.z.number().optional(),notes:c.z.string().optional()}),f=E.partial().extend({id:c.z.string().min(1),status:c.z.enum(["PENDING","CONFIRMED","IN_PROGRESS","COMPLETED","CANCELLED"]).optional()});function _(){return o.NextResponse.json({error:"Booking disabled"},{status:503})}async function N(e,{params:t}={},r){try{let t=await (0,u.getServerSession)(p.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:n}=new URL(e.url),i=n.get("start"),s=n.get("end"),a=n.get("artistId"),l=n.get("status"),c=(0,d.VK)(r?.env),m=`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE 1=1
    `,E=[];i&&(m+=" AND a.start_time >= ?",E.push(i)),s&&(m+=" AND a.end_time <= ?",E.push(s)),a&&(m+=" AND a.artist_id = ?",E.push(a)),l&&(m+=" AND a.status = ?",E.push(l)),m+=" ORDER BY a.start_time ASC";let f=c.prepare(m),_=await f.bind(...E).all();return o.NextResponse.json({appointments:_.results})}catch(e){return console.error("Error fetching appointments:",e),o.NextResponse.json({error:"Failed to fetch appointments"},{status:500})}}async function O(e,{params:t}={},r){try{if(!l.vU.BOOKING_ENABLED)return _();let t=await (0,u.getServerSession)(p.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let n=await e.json(),i=E.parse(n),s=(0,d.VK)(r?.env),a=s.prepare(`
      SELECT id FROM appointments 
      WHERE artist_id = ? 
      AND status NOT IN ('CANCELLED', 'COMPLETED')
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `);if((await a.bind(i.artistId,i.startTime,i.startTime,i.endTime,i.endTime,i.startTime,i.endTime).all()).results.length>0)return o.NextResponse.json({error:"Time slot conflicts with existing appointment"},{status:409});let c=crypto.randomUUID(),m=s.prepare(`
      INSERT INTO appointments (
        id, artist_id, client_id, title, description, start_time, end_time,
        status, deposit_amount, total_amount, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);await m.bind(c,i.artistId,i.clientId,i.title,i.description||null,i.startTime,i.endTime,i.depositAmount||null,i.totalAmount||null,i.notes||null).run();let f=s.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE a.id = ?
    `),N=await f.bind(c).first();return o.NextResponse.json({appointment:N},{status:201})}catch(e){if(console.error("Error creating appointment:",e),e instanceof c.z.ZodError)return o.NextResponse.json({error:"Invalid appointment data",details:e.errors},{status:400});return o.NextResponse.json({error:"Failed to create appointment"},{status:500})}}async function R(e,{params:t}={},r){try{if(!l.vU.BOOKING_ENABLED)return _();let t=await (0,u.getServerSession)(p.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let n=await e.json(),i=f.parse(n),s=(0,d.VK)(r?.env),a=s.prepare("SELECT * FROM appointments WHERE id = ?"),c=await a.bind(i.id).first();if(!c)return o.NextResponse.json({error:"Appointment not found"},{status:404});if(i.startTime||i.endTime){let e=i.startTime||c.start_time,t=i.endTime||c.end_time,r=i.artistId||c.artist_id,n=s.prepare(`
        SELECT id FROM appointments 
        WHERE artist_id = ? 
        AND id != ?
        AND status NOT IN ('CANCELLED', 'COMPLETED')
        AND (
          (start_time <= ? AND end_time > ?) OR
          (start_time < ? AND end_time >= ?) OR
          (start_time >= ? AND end_time <= ?)
        )
      `);if((await n.bind(r,i.id,e,e,t,t,e,t).all()).results.length>0)return o.NextResponse.json({error:"Time slot conflicts with existing appointment"},{status:409})}let m=[],E=[];if(Object.entries(i).forEach(([e,t])=>{if("id"!==e&&void 0!==t){let r=e.replace(/([A-Z])/g,"_$1").toLowerCase();m.push(`${r} = ?`),E.push(t)}}),0===m.length)return o.NextResponse.json({error:"No fields to update"},{status:400});m.push("updated_at = CURRENT_TIMESTAMP"),E.push(i.id);let N=s.prepare(`
      UPDATE appointments 
      SET ${m.join(", ")}
      WHERE id = ?
    `);await N.bind(...E).run();let O=s.prepare(`
      SELECT 
        a.*,
        ar.name as artist_name,
        u.name as client_name,
        u.email as client_email
      FROM appointments a
      JOIN artists ar ON a.artist_id = ar.id
      JOIN users u ON a.client_id = u.id
      WHERE a.id = ?
    `),R=await O.bind(i.id).first();return o.NextResponse.json({appointment:R})}catch(e){if(console.error("Error updating appointment:",e),e instanceof c.z.ZodError)return o.NextResponse.json({error:"Invalid appointment data",details:e.errors},{status:400});return o.NextResponse.json({error:"Failed to update appointment"},{status:500})}}async function A(e,{params:t}={},r){try{if(!l.vU.BOOKING_ENABLED)return _();let t=await (0,u.getServerSession)(p.Lz);if(!t?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:n}=new URL(e.url),i=n.get("id");if(!i)return o.NextResponse.json({error:"Appointment ID is required"},{status:400});let s=(0,d.VK)(r?.env).prepare("DELETE FROM appointments WHERE id = ?"),a=await s.bind(i).run(),c=a?.meta?.changes??a?.meta?.rows_written??0;if(0===c)return o.NextResponse.json({error:"Appointment not found"},{status:404});return o.NextResponse.json({success:!0})}catch(e){return console.error("Error deleting appointment:",e),o.NextResponse.json({error:"Failed to delete appointment"},{status:500})}}let T=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/appointments/route",pathname:"/api/appointments",filename:"route",bundlePath:"app/api/appointments/route"},resolvedPagePath:"/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo/app/api/appointments/route.ts",nextConfigOutput:"standalone",userland:n}),{requestAsyncStorage:D,staticGenerationAsyncStorage:g,serverHooks:x}=T,L="/api/appointments/route";function h(){return(0,a.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:g})}},93470:(e,t,r)=>{r.d(t,{L6:()=>u,vU:()=>p});let n=Object.freeze({ADMIN_ENABLED:!0,ARTISTS_MODULE_ENABLED:!0,UPLOADS_ADMIN_ENABLED:!0,BOOKING_ENABLED:!0,PUBLIC_APPOINTMENT_REQUESTS_ENABLED:!1,REFERENCE_UPLOADS_PUBLIC_ENABLED:!1,DEPOSITS_ENABLED:!1,PUBLIC_DB_ARTISTS_ENABLED:!1,ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED:!0,STRICT_CI_GATES_ENABLED:!0,ISR_CACHE_R2_ENABLED:!0}),i=Object.keys(n),s=new Set(i),a=new Set,o=null;function u(e={}){if(e.refresh&&(o=null),o)return o;let t=function(){let e={};for(let t of i){let r=function(e){let t=function(){if("undefined"!=typeof globalThis)return globalThis.__UNITED_TATTOO_RUNTIME_FLAGS__}();return t&&void 0!==t[e]?t[e]:"undefined"!=typeof process&&process.env&&void 0!==process.env[e]?process.env[e]:void 0}(t),i=function(e,t){if("boolean"==typeof e)return e;if("string"==typeof e){let t=e.trim().toLowerCase();if("true"===t||"1"===t)return!0;if("false"===t||"0"===t)return!1}return t}(r,n[t]);null!=r&&("string"!=typeof r||""!==r.trim())||a.has(t)||(a.add(t),"undefined"!=typeof console&&console.warn(`[flags] ${t} not provided; defaulting to ${i}. Set env var to override.`)),e[t]=i}return Object.freeze(e)}();return o=t,t}let p=new Proxy({},{get:(e,t)=>{if(s.has(t))return u()[t]},ownKeys:()=>i,getOwnPropertyDescriptor:(e,t)=>{if(s.has(t))return{configurable:!0,enumerable:!0,value:u()[t]}}})},32482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},18445:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});var n={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s.default}});var i=r(32482);Object.keys(i).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e))&&(e in t&&t[e]===i[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}}))});var s=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=a(void 0);if(r&&r.has(e))return r.get(e);var n={__proto__:null},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var o=i?Object.getOwnPropertyDescriptor(e,s):null;o&&(o.get||o.set)?Object.defineProperty(n,s,o):n[s]=e[s]}return n.default=e,r&&r.set(e,n),n}(r(4128));function a(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(a=function(e){return e?r:t})(e)}Object.keys(s).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(n,e))&&(e in t&&t[e]===s[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return s[e]}}))})}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[9379,8213,4128,4833,1253],()=>r(33569));module.exports=n})();