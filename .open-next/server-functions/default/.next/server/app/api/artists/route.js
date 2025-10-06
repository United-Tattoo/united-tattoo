"use strict";(()=>{var e={};e.id=3196,e.ids=[3196,1035],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},60349:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>R,patchFetch:()=>T,requestAsyncStorage:()=>g,routeModule:()=>m,serverHooks:()=>v,staticGenerationAsyncStorage:()=>h});var a={};i.r(a),i.d(a,{GET:()=>E,POST:()=>f,dynamic:()=>_});var r=i(73278),s=i(45002),n=i(54877),o=i(71309),u=i(33897),l=i(74725),p=i(69362),d=i(1035),c=i(93470);let _="force-dynamic";async function E(e,{params:t}={},i){try{let{searchParams:t}=new URL(e.url),a=p.dC.parse({page:t.get("page")||"1",limit:t.get("limit")||"50"}),r=p.NK.parse({isActive:t.get("isActive"),specialty:t.get("specialty"),search:t.get("search")}),s={specialty:r.specialty||void 0,search:r.search||void 0,isActive:void 0===r.isActive||r.isActive,limit:a.limit,offset:(a.page-1)*a.limit},n=await (0,d.Hf)(s,i?.env),u=n.length===a.limit;return o.NextResponse.json({artists:n,pagination:{page:a.page,limit:a.limit,hasMore:u},filters:r})}catch(e){return console.error("Error fetching artists:",e),o.NextResponse.json({error:"Failed to fetch artists"},{status:500})}}async function f(e,{params:t}={},i){try{if(!c.vU.ARTISTS_MODULE_ENABLED)return o.NextResponse.json({error:"Artists module disabled"},{status:503});let t=await (0,u.mk)(l.i.SHOP_ADMIN),a=await e.json(),r=p.Jt.parse(a),s=await (0,d.Rw)({...r,userId:t.user.id},i?.env);return o.NextResponse.json(s,{status:201})}catch(e){if(console.error("Error creating artist:",e),e instanceof Error){if(e.message.includes("Authentication required"))return o.NextResponse.json({error:"Authentication required"},{status:401});if(e.message.includes("Insufficient permissions"))return o.NextResponse.json({error:"Insufficient permissions"},{status:403})}return o.NextResponse.json({error:"Failed to create artist"},{status:500})}}let m=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/artists/route",pathname:"/api/artists",filename:"route",bundlePath:"app/api/artists/route"},resolvedPagePath:"/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo/app/api/artists/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:g,staticGenerationAsyncStorage:h,serverHooks:v}=m,R="/api/artists/route";function T(){return(0,n.patchFetch)({serverHooks:v,staticGenerationAsyncStorage:h})}},1035:(e,t,i)=>{function a(e){if(e?.DB)return e.DB;let t=globalThis[Symbol.for("__cloudflare-context__")],i=t?.env?.DB,a=globalThis.DB||globalThis.env?.DB,r=i||a;if(!r)throw Error("Cloudflare D1 binding (env.DB) is unavailable");return r}async function r(e,t){let i=a(t),r=`
    SELECT 
      a.id,
      a.slug,
      a.name,
      a.bio,
      a.specialties,
      a.instagram_handle,
      a.is_active,
      a.hourly_rate
    FROM artists a
    WHERE a.is_active = 1
  `,s=[];e?.specialty&&(r+=" AND a.specialties LIKE ?",s.push(`%${e.specialty}%`)),e?.search&&(r+=" AND (a.name LIKE ? OR a.bio LIKE ?)",s.push(`%${e.search}%`,`%${e.search}%`)),r+=" ORDER BY a.created_at DESC",e?.limit&&(r+=" LIMIT ?",s.push(e.limit)),e?.offset&&(r+=" OFFSET ?",s.push(e.offset));let n=await i.prepare(r).bind(...s).all();return await Promise.all(n.results.map(async e=>{let t=await i.prepare(`
        SELECT * FROM portfolio_images 
        WHERE artist_id = ? AND is_public = 1
        ORDER BY order_index ASC, created_at DESC
      `).bind(e.id).all();return{id:e.id,slug:e.slug,name:e.name,bio:e.bio,specialties:e.specialties?JSON.parse(e.specialties):[],instagramHandle:e.instagram_handle,isActive:!!e.is_active,hourlyRate:e.hourly_rate,portfolioImages:t.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)}))}}))}async function s(e,t){let i=a(t),r=await i.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `).bind(e).first();if(!r)return null;let s=await i.prepare(`
    SELECT * FROM portfolio_images 
    WHERE artist_id = ?
    ORDER BY order_index ASC, created_at DESC
  `).bind(e).all();return{id:r.id,userId:r.user_id,slug:r.slug,name:r.name,bio:r.bio,specialties:r.specialties?JSON.parse(r.specialties):[],instagramHandle:r.instagram_handle,isActive:!!r.is_active,hourlyRate:r.hourly_rate,portfolioImages:s.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)})),availability:[],createdAt:new Date(r.created_at),updatedAt:new Date(r.updated_at),user:{name:r.user_name,email:r.user_email,avatar:r.user_avatar}}}async function n(e,t){let i=a(t),r=await i.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.slug = ?
  `).bind(e).first();return r?s(r.id,t):null}async function o(e,t){let i=a(t),r=await i.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.user_id = ?
  `).bind(e).first();return r?{id:r.id,userId:r.user_id,slug:r.slug,name:r.name,bio:r.bio,specialties:r.specialties?JSON.parse(r.specialties):[],instagramHandle:r.instagram_handle,isActive:!!r.is_active,hourlyRate:r.hourly_rate,portfolioImages:[],availability:[],createdAt:new Date(r.created_at),updatedAt:new Date(r.updated_at)}:null}async function u(e,t){let i=a(t),r=crypto.randomUUID(),s=e.userId;if(!s){let t=await i.prepare(`
      INSERT INTO users (id, email, name, role)
      VALUES (?, ?, ?, 'ARTIST')
      RETURNING id
    `).bind(crypto.randomUUID(),e.email||`${e.name.toLowerCase().replace(/\s+/g,".")}@unitedtattoo.com`,e.name).first();s=t?.id}return await i.prepare(`
    INSERT INTO artists (id, user_id, name, bio, specialties, instagram_handle, hourly_rate, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(r,s,e.name,e.bio,JSON.stringify(e.specialties),e.instagramHandle||null,e.hourlyRate||null,!1!==e.isActive).first()}async function l(e,t,i){let r=a(i),s=[],n=[];return void 0!==t.name&&(s.push("name = ?"),n.push(t.name)),void 0!==t.bio&&(s.push("bio = ?"),n.push(t.bio)),void 0!==t.specialties&&(s.push("specialties = ?"),n.push(JSON.stringify(t.specialties))),void 0!==t.instagramHandle&&(s.push("instagram_handle = ?"),n.push(t.instagramHandle)),void 0!==t.hourlyRate&&(s.push("hourly_rate = ?"),n.push(t.hourlyRate)),void 0!==t.isActive&&(s.push("is_active = ?"),n.push(t.isActive)),s.push("updated_at = CURRENT_TIMESTAMP"),n.push(e),await r.prepare(`
    UPDATE artists 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function p(e,t){let i=a(t);await i.prepare("UPDATE artists SET is_active = 0 WHERE id = ?").bind(e).run()}async function d(e,t,i){let r=a(i),s=crypto.randomUUID();return await r.prepare(`
    INSERT INTO portfolio_images (id, artist_id, url, caption, tags, order_index, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(s,e,t.url,t.caption||null,t.tags?JSON.stringify(t.tags):null,t.orderIndex||0,!1!==t.isPublic).first()}async function c(e,t,i){let r=a(i),s=[],n=[];return void 0!==t.url&&(s.push("url = ?"),n.push(t.url)),void 0!==t.caption&&(s.push("caption = ?"),n.push(t.caption)),void 0!==t.tags&&(s.push("tags = ?"),n.push(t.tags?JSON.stringify(t.tags):null)),void 0!==t.orderIndex&&(s.push("order_index = ?"),n.push(t.orderIndex)),void 0!==t.isPublic&&(s.push("is_public = ?"),n.push(t.isPublic)),n.push(e),await r.prepare(`
    UPDATE portfolio_images 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function _(e,t){let i=a(t);await i.prepare("DELETE FROM portfolio_images WHERE id = ?").bind(e).run()}function E(e){if(e?.R2_BUCKET)return e.R2_BUCKET;let t=globalThis[Symbol.for("__cloudflare-context__")],i=t?.env?.R2_BUCKET,a=globalThis.R2_BUCKET||globalThis.env?.R2_BUCKET,r=i||a;if(!r)throw Error("Cloudflare R2 binding (env.R2_BUCKET) is unavailable");return r}i.d(t,{Hf:()=>r,Ms:()=>E,Rw:()=>u,VK:()=>a,W0:()=>c,cP:()=>_,ce:()=>s,ep:()=>l,ex:()=>n,getArtistByUserId:()=>o,vB:()=>p,xd:()=>d})},93470:(e,t,i)=>{i.d(t,{L6:()=>u,vU:()=>l});let a=Object.freeze({ADMIN_ENABLED:!0,ARTISTS_MODULE_ENABLED:!0,UPLOADS_ADMIN_ENABLED:!0,BOOKING_ENABLED:!0,PUBLIC_APPOINTMENT_REQUESTS_ENABLED:!1,REFERENCE_UPLOADS_PUBLIC_ENABLED:!1,DEPOSITS_ENABLED:!1,PUBLIC_DB_ARTISTS_ENABLED:!1,ADVANCED_NAV_SCROLL_ANIMATIONS_ENABLED:!0,STRICT_CI_GATES_ENABLED:!0,ISR_CACHE_R2_ENABLED:!0}),r=Object.keys(a),s=new Set(r),n=new Set,o=null;function u(e={}){if(e.refresh&&(o=null),o)return o;let t=function(){let e={};for(let t of r){let i=function(e){let t=function(){if("undefined"!=typeof globalThis)return globalThis.__UNITED_TATTOO_RUNTIME_FLAGS__}();return t&&void 0!==t[e]?t[e]:"undefined"!=typeof process&&process.env&&void 0!==process.env[e]?process.env[e]:void 0}(t),r=function(e,t){if("boolean"==typeof e)return e;if("string"==typeof e){let t=e.trim().toLowerCase();if("true"===t||"1"===t)return!0;if("false"===t||"0"===t)return!1}return t}(i,a[t]);null!=i&&("string"!=typeof i||""!==i.trim())||n.has(t)||(n.add(t),"undefined"!=typeof console&&console.warn(`[flags] ${t} not provided; defaulting to ${r}. Set env var to override.`)),e[t]=r}return Object.freeze(e)}();return o=t,t}let l=new Proxy({},{get:(e,t)=>{if(s.has(t))return u()[t]},ownKeys:()=>r,getOwnPropertyDescriptor:(e,t)=>{if(s.has(t))return{configurable:!0,enumerable:!0,value:u()[t]}}})}};var t=require("../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),a=t.X(0,[9379,3670,4833,2064],()=>i(60349));module.exports=a})();