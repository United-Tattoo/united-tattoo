"use strict";(()=>{var e={};e.id=6553,e.ids=[6553],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},61871:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>N,patchFetch:()=>v,requestAsyncStorage:()=>m,routeModule:()=>d,serverHooks:()=>S,staticGenerationAsyncStorage:()=>f});var a={};r.r(a),r.d(a,{GET:()=>c,dynamic:()=>E});var n=r(73278),o=r(45002),s=r(54877),i=r(71309),l=r(18445),u=r(33897),p=r(1035);let E="force-dynamic";async function c(e,{params:t}={},r){try{let e=await (0,l.getServerSession)(u.Lz);if(!e?.user)return i.NextResponse.json({error:"Unauthorized"},{status:401});let t=(0,p.VK)(r?.env),a=await t.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive
      FROM artists
    `).first(),n=await t.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END) as confirmed,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as inProgress,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled,
        SUM(CASE WHEN strftime('%Y-%m', start_time) = strftime('%Y-%m', 'now') THEN 1 ELSE 0 END) as thisMonth,
        SUM(CASE WHEN strftime('%Y-%m', start_time) = strftime('%Y-%m', 'now', '-1 month') THEN 1 ELSE 0 END) as lastMonth,
        SUM(CASE WHEN status = 'COMPLETED' THEN COALESCE(total_amount, 0) ELSE 0 END) as revenue
      FROM appointments
    `).first(),o=await t.prepare(`
      SELECT 
        COUNT(*) as totalImages,
        SUM(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 ELSE 0 END) as recentUploads
      FROM portfolio_images
      WHERE is_public = 1
    `).first(),s=await t.prepare(`
      SELECT 
        COUNT(*) as totalUploads,
        SUM(size) as totalSize,
        SUM(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 ELSE 0 END) as recentUploads
      FROM file_uploads
    `).first(),E=((await t.prepare(`
      SELECT 
        strftime('%Y-%m', start_time) as month,
        COUNT(*) as appointments,
        SUM(CASE WHEN status = 'COMPLETED' THEN COALESCE(total_amount, 0) ELSE 0 END) as revenue
      FROM appointments
      WHERE start_time >= date('now', '-6 months')
      GROUP BY strftime('%Y-%m', start_time)
      ORDER BY month
    `).all()).results||[]).map(e=>({month:new Date(e.month+"-01").toLocaleDateString("en-US",{month:"short",year:"numeric"}),appointments:e.appointments||0,revenue:e.revenue||0})),c=[{name:"Pending",value:n?.pending||0,color:"#f59e0b"},{name:"Confirmed",value:n?.confirmed||0,color:"#3b82f6"},{name:"In Progress",value:n?.inProgress||0,color:"#10b981"},{name:"Completed",value:n?.completed||0,color:"#6b7280"},{name:"Cancelled",value:n?.cancelled||0,color:"#ef4444"}].filter(e=>e.value>0),d={artists:{total:a?.total||0,active:a?.active||0,inactive:a?.inactive||0},appointments:{total:n?.total||0,pending:n?.pending||0,confirmed:n?.confirmed||0,inProgress:n?.inProgress||0,completed:n?.completed||0,cancelled:n?.cancelled||0,thisMonth:n?.thisMonth||0,lastMonth:n?.lastMonth||0,revenue:n?.revenue||0},portfolio:{totalImages:o?.totalImages||0,recentUploads:o?.recentUploads||0},files:{totalUploads:s?.totalUploads||0,totalSize:s?.totalSize||0,recentUploads:s?.recentUploads||0},monthlyData:E,statusData:c};return i.NextResponse.json(d)}catch(e){return console.error("Error fetching dashboard stats:",e),i.NextResponse.json({error:"Failed to fetch dashboard statistics"},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/admin/stats/route",pathname:"/api/admin/stats",filename:"route",bundlePath:"app/api/admin/stats/route"},resolvedPagePath:"/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo/app/api/admin/stats/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:f,serverHooks:S}=d,N="/api/admin/stats/route";function v(){return(0,s.patchFetch)({serverHooks:S,staticGenerationAsyncStorage:f})}},32482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},18445:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});var a={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return o.default}});var n=r(32482);Object.keys(n).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e))&&(e in t&&t[e]===n[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return n[e]}}))});var o=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=s(void 0);if(r&&r.has(e))return r.get(e);var a={__proto__:null},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&({}).hasOwnProperty.call(e,o)){var i=n?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(a,o,i):a[o]=e[o]}return a.default=e,r&&r.set(e,a),a}(r(4128));function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(s=function(e){return e?r:t})(e)}Object.keys(o).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(a,e))&&(e in t&&t[e]===o[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}}))})}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[9379,8213,4128,4833,1253],()=>r(61871));module.exports=a})();