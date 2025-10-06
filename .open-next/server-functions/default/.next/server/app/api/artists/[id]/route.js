"use strict";(()=>{var e={};e.id=3671,e.ids=[3671,1035],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},59773:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>v,patchFetch:()=>x,requestAsyncStorage:()=>h,routeModule:()=>f,serverHooks:()=>R,staticGenerationAsyncStorage:()=>g});var i={};a.r(i),a.d(i,{DELETE:()=>E,GET:()=>m,PUT:()=>_,dynamic:()=>c});var r=a(73278),s=a(45002),n=a(54877),o=a(71309),u=a(33897),l=a(74725),d=a(69362),p=a(1035);let c="force-dynamic";async function m(e,{params:t},a){try{let{id:e}=t,i=await (0,p.ce)(e,a?.env);if(i||(i=await (0,p.ex)(e,a?.env)),!i)return o.NextResponse.json({error:"Artist not found"},{status:404});return o.NextResponse.json(i)}catch(e){return console.error("Error fetching artist:",e),o.NextResponse.json({error:"Failed to fetch artist"},{status:500})}}async function _(e,{params:t},a){try{let{id:i}=t,r=await (0,u.mk)(),s=await (0,p.ce)(i,a?.env);if(!s)return o.NextResponse.json({error:"Artist not found"},{status:404});let n=s.userId===r.user.id,c=[l.i.SUPER_ADMIN,l.i.SHOP_ADMIN].includes(r.user.role);if(!n&&!c)return o.NextResponse.json({error:"Insufficient permissions"},{status:403});let m=await e.json(),_=d.xD.parse(m),E=_;if(n&&!c){let{bio:e,specialties:t,instagramHandle:a,hourlyRate:i}=_;E={bio:e,specialties:t,instagramHandle:a,hourlyRate:i}}let f=await (0,p.ep)(i,E,a?.env);return o.NextResponse.json(f)}catch(e){if(console.error("Error updating artist:",e),e instanceof Error&&e.message.includes("Authentication required"))return o.NextResponse.json({error:"Authentication required"},{status:401});return o.NextResponse.json({error:"Failed to update artist"},{status:500})}}async function E(e,{params:t},a){try{let{id:e}=t;return await (0,u.mk)(l.i.SHOP_ADMIN),await (0,p.vB)(e,a?.env),o.NextResponse.json({success:!0})}catch(e){if(console.error("Error deleting artist:",e),e instanceof Error){if(e.message.includes("Authentication required"))return o.NextResponse.json({error:"Authentication required"},{status:401});if(e.message.includes("Insufficient permissions"))return o.NextResponse.json({error:"Insufficient permissions"},{status:403})}return o.NextResponse.json({error:"Failed to delete artist"},{status:500})}}let f=new r.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/artists/[id]/route",pathname:"/api/artists/[id]",filename:"route",bundlePath:"app/api/artists/[id]/route"},resolvedPagePath:"/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo/app/api/artists/[id]/route.ts",nextConfigOutput:"standalone",userland:i}),{requestAsyncStorage:h,staticGenerationAsyncStorage:g,serverHooks:R}=f,v="/api/artists/[id]/route";function x(){return(0,n.patchFetch)({serverHooks:R,staticGenerationAsyncStorage:g})}},1035:(e,t,a)=>{function i(e){if(e?.DB)return e.DB;let t=globalThis[Symbol.for("__cloudflare-context__")],a=t?.env?.DB,i=globalThis.DB||globalThis.env?.DB,r=a||i;if(!r)throw Error("Cloudflare D1 binding (env.DB) is unavailable");return r}async function r(e,t){let a=i(t),r=`
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
  `,s=[];e?.specialty&&(r+=" AND a.specialties LIKE ?",s.push(`%${e.specialty}%`)),e?.search&&(r+=" AND (a.name LIKE ? OR a.bio LIKE ?)",s.push(`%${e.search}%`,`%${e.search}%`)),r+=" ORDER BY a.created_at DESC",e?.limit&&(r+=" LIMIT ?",s.push(e.limit)),e?.offset&&(r+=" OFFSET ?",s.push(e.offset));let n=await a.prepare(r).bind(...s).all();return await Promise.all(n.results.map(async e=>{let t=await a.prepare(`
        SELECT * FROM portfolio_images 
        WHERE artist_id = ? AND is_public = 1
        ORDER BY order_index ASC, created_at DESC
      `).bind(e.id).all();return{id:e.id,slug:e.slug,name:e.name,bio:e.bio,specialties:e.specialties?JSON.parse(e.specialties):[],instagramHandle:e.instagram_handle,isActive:!!e.is_active,hourlyRate:e.hourly_rate,portfolioImages:t.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)}))}}))}async function s(e,t){let a=i(t),r=await a.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `).bind(e).first();if(!r)return null;let s=await a.prepare(`
    SELECT * FROM portfolio_images 
    WHERE artist_id = ?
    ORDER BY order_index ASC, created_at DESC
  `).bind(e).all();return{id:r.id,userId:r.user_id,slug:r.slug,name:r.name,bio:r.bio,specialties:r.specialties?JSON.parse(r.specialties):[],instagramHandle:r.instagram_handle,isActive:!!r.is_active,hourlyRate:r.hourly_rate,portfolioImages:s.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)})),availability:[],createdAt:new Date(r.created_at),updatedAt:new Date(r.updated_at),user:{name:r.user_name,email:r.user_email,avatar:r.user_avatar}}}async function n(e,t){let a=i(t),r=await a.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.slug = ?
  `).bind(e).first();return r?s(r.id,t):null}async function o(e,t){let a=i(t),r=await a.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.user_id = ?
  `).bind(e).first();return r?{id:r.id,userId:r.user_id,slug:r.slug,name:r.name,bio:r.bio,specialties:r.specialties?JSON.parse(r.specialties):[],instagramHandle:r.instagram_handle,isActive:!!r.is_active,hourlyRate:r.hourly_rate,portfolioImages:[],availability:[],createdAt:new Date(r.created_at),updatedAt:new Date(r.updated_at)}:null}async function u(e,t){let a=i(t),r=crypto.randomUUID(),s=e.userId;if(!s){let t=await a.prepare(`
      INSERT INTO users (id, email, name, role)
      VALUES (?, ?, ?, 'ARTIST')
      RETURNING id
    `).bind(crypto.randomUUID(),e.email||`${e.name.toLowerCase().replace(/\s+/g,".")}@unitedtattoo.com`,e.name).first();s=t?.id}return await a.prepare(`
    INSERT INTO artists (id, user_id, name, bio, specialties, instagram_handle, hourly_rate, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(r,s,e.name,e.bio,JSON.stringify(e.specialties),e.instagramHandle||null,e.hourlyRate||null,!1!==e.isActive).first()}async function l(e,t,a){let r=i(a),s=[],n=[];return void 0!==t.name&&(s.push("name = ?"),n.push(t.name)),void 0!==t.bio&&(s.push("bio = ?"),n.push(t.bio)),void 0!==t.specialties&&(s.push("specialties = ?"),n.push(JSON.stringify(t.specialties))),void 0!==t.instagramHandle&&(s.push("instagram_handle = ?"),n.push(t.instagramHandle)),void 0!==t.hourlyRate&&(s.push("hourly_rate = ?"),n.push(t.hourlyRate)),void 0!==t.isActive&&(s.push("is_active = ?"),n.push(t.isActive)),s.push("updated_at = CURRENT_TIMESTAMP"),n.push(e),await r.prepare(`
    UPDATE artists 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function d(e,t){let a=i(t);await a.prepare("UPDATE artists SET is_active = 0 WHERE id = ?").bind(e).run()}async function p(e,t,a){let r=i(a),s=crypto.randomUUID();return await r.prepare(`
    INSERT INTO portfolio_images (id, artist_id, url, caption, tags, order_index, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(s,e,t.url,t.caption||null,t.tags?JSON.stringify(t.tags):null,t.orderIndex||0,!1!==t.isPublic).first()}async function c(e,t,a){let r=i(a),s=[],n=[];return void 0!==t.url&&(s.push("url = ?"),n.push(t.url)),void 0!==t.caption&&(s.push("caption = ?"),n.push(t.caption)),void 0!==t.tags&&(s.push("tags = ?"),n.push(t.tags?JSON.stringify(t.tags):null)),void 0!==t.orderIndex&&(s.push("order_index = ?"),n.push(t.orderIndex)),void 0!==t.isPublic&&(s.push("is_public = ?"),n.push(t.isPublic)),n.push(e),await r.prepare(`
    UPDATE portfolio_images 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function m(e,t){let a=i(t);await a.prepare("DELETE FROM portfolio_images WHERE id = ?").bind(e).run()}function _(e){if(e?.R2_BUCKET)return e.R2_BUCKET;let t=globalThis[Symbol.for("__cloudflare-context__")],a=t?.env?.R2_BUCKET,i=globalThis.R2_BUCKET||globalThis.env?.R2_BUCKET,r=a||i;if(!r)throw Error("Cloudflare R2 binding (env.R2_BUCKET) is unavailable");return r}a.d(t,{Hf:()=>r,Ms:()=>_,Rw:()=>u,VK:()=>i,W0:()=>c,cP:()=>m,ce:()=>s,ep:()=>l,ex:()=>n,getArtistByUserId:()=>o,vB:()=>d,xd:()=>p})}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),i=t.X(0,[9379,3670,4833,2064],()=>a(59773));module.exports=i})();