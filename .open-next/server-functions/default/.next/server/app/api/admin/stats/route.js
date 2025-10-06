"use strict";(()=>{var e={};e.id=6553,e.ids=[6553,1035],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},61871:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>S,patchFetch:()=>N,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>f,staticGenerationAsyncStorage:()=>_});var r={};a.r(r),a.d(r,{GET:()=>c,dynamic:()=>E});var i=a(73278),s=a(45002),n=a(54877),o=a(71309),l=a(18445),u=a(33897),d=a(1035);let E="force-dynamic";async function c(e,{params:t}={},a){try{let e=await (0,l.getServerSession)(u.Lz);if(!e?.user)return o.NextResponse.json({error:"Unauthorized"},{status:401});let t=(0,d.VK)(a?.env),r=await t.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive
      FROM artists
    `).first(),i=await t.prepare(`
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
    `).first(),s=await t.prepare(`
      SELECT 
        COUNT(*) as totalImages,
        SUM(CASE WHEN date(created_at) >= date('now', '-7 days') THEN 1 ELSE 0 END) as recentUploads
      FROM portfolio_images
      WHERE is_public = 1
    `).first(),n=await t.prepare(`
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
    `).all()).results||[]).map(e=>({month:new Date(e.month+"-01").toLocaleDateString("en-US",{month:"short",year:"numeric"}),appointments:e.appointments||0,revenue:e.revenue||0})),c=[{name:"Pending",value:i?.pending||0,color:"#f59e0b"},{name:"Confirmed",value:i?.confirmed||0,color:"#3b82f6"},{name:"In Progress",value:i?.inProgress||0,color:"#10b981"},{name:"Completed",value:i?.completed||0,color:"#6b7280"},{name:"Cancelled",value:i?.cancelled||0,color:"#ef4444"}].filter(e=>e.value>0),p={artists:{total:r?.total||0,active:r?.active||0,inactive:r?.inactive||0},appointments:{total:i?.total||0,pending:i?.pending||0,confirmed:i?.confirmed||0,inProgress:i?.inProgress||0,completed:i?.completed||0,cancelled:i?.cancelled||0,thisMonth:i?.thisMonth||0,lastMonth:i?.lastMonth||0,revenue:i?.revenue||0},portfolio:{totalImages:s?.totalImages||0,recentUploads:s?.recentUploads||0},files:{totalUploads:n?.totalUploads||0,totalSize:n?.totalSize||0,recentUploads:n?.recentUploads||0},monthlyData:E,statusData:c};return o.NextResponse.json(p)}catch(e){return console.error("Error fetching dashboard stats:",e),o.NextResponse.json({error:"Failed to fetch dashboard statistics"},{status:500})}}let p=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/admin/stats/route",pathname:"/api/admin/stats",filename:"route",bundlePath:"app/api/admin/stats/route"},resolvedPagePath:"/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo/app/api/admin/stats/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:_,serverHooks:f}=p,S="/api/admin/stats/route";function N(){return(0,n.patchFetch)({serverHooks:f,staticGenerationAsyncStorage:_})}},33897:(e,t,a)=>{a.d(t,{Lz:()=>d,KR:()=>m,Z1:()=>E,GJ:()=>p,KN:()=>_,mk:()=>c});var r=a(22571),i=a(43016),s=a(76214),n=a(29628);let o=n.z.object({DATABASE_URL:n.z.string().url(),DIRECT_URL:n.z.string().url().optional(),NEXTAUTH_URL:n.z.string().url(),NEXTAUTH_SECRET:n.z.string().min(1),GOOGLE_CLIENT_ID:n.z.string().optional(),GOOGLE_CLIENT_SECRET:n.z.string().optional(),GITHUB_CLIENT_ID:n.z.string().optional(),GITHUB_CLIENT_SECRET:n.z.string().optional(),AWS_ACCESS_KEY_ID:n.z.string().min(1),AWS_SECRET_ACCESS_KEY:n.z.string().min(1),AWS_REGION:n.z.string().min(1),AWS_BUCKET_NAME:n.z.string().min(1),AWS_ENDPOINT_URL:n.z.string().url().optional(),NODE_ENV:n.z.enum(["development","production","test"]).default("development"),SMTP_HOST:n.z.string().optional(),SMTP_PORT:n.z.string().optional(),SMTP_USER:n.z.string().optional(),SMTP_PASSWORD:n.z.string().optional(),VERCEL_ANALYTICS_ID:n.z.string().optional()}),l=function(){try{return o.parse(process.env)}catch(e){if(e instanceof n.z.ZodError){let t=e.errors.map(e=>e.path.join(".")).join(", ");throw Error(`Missing or invalid environment variables: ${t}`)}throw e}}();var u=a(74725);let d={providers:[(0,s.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(console.log("Authorize called with:",e),!e?.email||!e?.password)return console.log("Missing email or password"),null;if(console.log("Email received:",e.email),console.log("Password received:",e.password?"***":"empty"),"nicholai@biohazardvfx.com"===e.email)return console.log("Admin user recognized!"),{id:"admin-nicholai",email:"nicholai@biohazardvfx.com",name:"Nicholai",role:u.i.SUPER_ADMIN};console.log("Using fallback user creation");let t={id:"dev-user-"+Date.now(),email:e.email,name:e.email.split("@")[0],role:u.i.SUPER_ADMIN};return console.log("Created user:",t),t}}),...l.GOOGLE_CLIENT_ID&&l.GOOGLE_CLIENT_SECRET?[(0,r.Z)({clientId:l.GOOGLE_CLIENT_ID,clientSecret:l.GOOGLE_CLIENT_SECRET})]:[],...l.GITHUB_CLIENT_ID&&l.GITHUB_CLIENT_SECRET?[(0,i.Z)({clientId:l.GITHUB_CLIENT_ID,clientSecret:l.GITHUB_CLIENT_SECRET})]:[]],session:{strategy:"jwt",maxAge:2592e3},callbacks:{jwt:async({token:e,user:t,account:a})=>(t&&(e.role=t.role||u.i.CLIENT,e.userId=t.id),e),session:async({session:e,token:t})=>(t&&(e.user.id=t.userId,e.user.role=t.role),e),signIn:async({user:e,account:t,profile:a})=>!0,redirect:async({url:e,baseUrl:t})=>e.startsWith("/")?`${t}${e}`:new URL(e).origin===t?e:`${t}/admin`},pages:{signIn:"/auth/signin",error:"/auth/error"},events:{async signIn({user:e,account:t,profile:a,isNewUser:r}){console.log(`User ${e.email} signed in`)},async signOut({session:e,token:t}){console.log("User signed out")}},debug:"development"===l.NODE_ENV};async function E(){let{getServerSession:e}=await a.e(4128).then(a.bind(a,4128));return e(d)}async function c(e){let t=await E();if(!t)throw Error("Authentication required");if(e&&!function(e,t){let a={[u.i.CLIENT]:0,[u.i.ARTIST]:1,[u.i.SHOP_ADMIN]:2,[u.i.SUPER_ADMIN]:3};return a[e]>=a[t]}(t.user.role,e))throw Error("Insufficient permissions");return t}function p(e){return e===u.i.SHOP_ADMIN||e===u.i.SUPER_ADMIN}async function m(){let e=await E();if(!e?.user)return null;let t=e.user.role;if(t!==u.i.ARTIST&&!p(t))return null;let{getArtistByUserId:r}=await a.e(1035).then(a.bind(a,1035)),i=await r(e.user.id);return i?{artist:i,user:e.user}:null}async function _(){let e=await m();if(!e)throw Error("Artist authentication required");return e}},1035:(e,t,a)=>{function r(e){if(e?.DB)return e.DB;let t=globalThis[Symbol.for("__cloudflare-context__")],a=t?.env?.DB,r=globalThis.DB||globalThis.env?.DB,i=a||r;if(!i)throw Error("Cloudflare D1 binding (env.DB) is unavailable");return i}async function i(e,t){let a=r(t),i=`
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
  `,s=[];e?.specialty&&(i+=" AND a.specialties LIKE ?",s.push(`%${e.specialty}%`)),e?.search&&(i+=" AND (a.name LIKE ? OR a.bio LIKE ?)",s.push(`%${e.search}%`,`%${e.search}%`)),i+=" ORDER BY a.created_at DESC",e?.limit&&(i+=" LIMIT ?",s.push(e.limit)),e?.offset&&(i+=" OFFSET ?",s.push(e.offset));let n=await a.prepare(i).bind(...s).all();return await Promise.all(n.results.map(async e=>{let t=await a.prepare(`
        SELECT * FROM portfolio_images 
        WHERE artist_id = ? AND is_public = 1
        ORDER BY order_index ASC, created_at DESC
      `).bind(e.id).all();return{id:e.id,slug:e.slug,name:e.name,bio:e.bio,specialties:e.specialties?JSON.parse(e.specialties):[],instagramHandle:e.instagram_handle,isActive:!!e.is_active,hourlyRate:e.hourly_rate,portfolioImages:t.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)}))}}))}async function s(e,t){let a=r(t),i=await a.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `).bind(e).first();if(!i)return null;let s=await a.prepare(`
    SELECT * FROM portfolio_images 
    WHERE artist_id = ?
    ORDER BY order_index ASC, created_at DESC
  `).bind(e).all();return{id:i.id,userId:i.user_id,slug:i.slug,name:i.name,bio:i.bio,specialties:i.specialties?JSON.parse(i.specialties):[],instagramHandle:i.instagram_handle,isActive:!!i.is_active,hourlyRate:i.hourly_rate,portfolioImages:s.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)})),availability:[],createdAt:new Date(i.created_at),updatedAt:new Date(i.updated_at),user:{name:i.user_name,email:i.user_email,avatar:i.user_avatar}}}async function n(e,t){let a=r(t),i=await a.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.slug = ?
  `).bind(e).first();return i?s(i.id,t):null}async function o(e,t){let a=r(t),i=await a.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.user_id = ?
  `).bind(e).first();return i?{id:i.id,userId:i.user_id,slug:i.slug,name:i.name,bio:i.bio,specialties:i.specialties?JSON.parse(i.specialties):[],instagramHandle:i.instagram_handle,isActive:!!i.is_active,hourlyRate:i.hourly_rate,portfolioImages:[],availability:[],createdAt:new Date(i.created_at),updatedAt:new Date(i.updated_at)}:null}async function l(e,t){let a=r(t),i=crypto.randomUUID(),s=e.userId;if(!s){let t=await a.prepare(`
      INSERT INTO users (id, email, name, role)
      VALUES (?, ?, ?, 'ARTIST')
      RETURNING id
    `).bind(crypto.randomUUID(),e.email||`${e.name.toLowerCase().replace(/\s+/g,".")}@unitedtattoo.com`,e.name).first();s=t?.id}return await a.prepare(`
    INSERT INTO artists (id, user_id, name, bio, specialties, instagram_handle, hourly_rate, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(i,s,e.name,e.bio,JSON.stringify(e.specialties),e.instagramHandle||null,e.hourlyRate||null,!1!==e.isActive).first()}async function u(e,t,a){let i=r(a),s=[],n=[];return void 0!==t.name&&(s.push("name = ?"),n.push(t.name)),void 0!==t.bio&&(s.push("bio = ?"),n.push(t.bio)),void 0!==t.specialties&&(s.push("specialties = ?"),n.push(JSON.stringify(t.specialties))),void 0!==t.instagramHandle&&(s.push("instagram_handle = ?"),n.push(t.instagramHandle)),void 0!==t.hourlyRate&&(s.push("hourly_rate = ?"),n.push(t.hourlyRate)),void 0!==t.isActive&&(s.push("is_active = ?"),n.push(t.isActive)),s.push("updated_at = CURRENT_TIMESTAMP"),n.push(e),await i.prepare(`
    UPDATE artists 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function d(e,t){let a=r(t);await a.prepare("UPDATE artists SET is_active = 0 WHERE id = ?").bind(e).run()}async function E(e,t,a){let i=r(a),s=crypto.randomUUID();return await i.prepare(`
    INSERT INTO portfolio_images (id, artist_id, url, caption, tags, order_index, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(s,e,t.url,t.caption||null,t.tags?JSON.stringify(t.tags):null,t.orderIndex||0,!1!==t.isPublic).first()}async function c(e,t,a){let i=r(a),s=[],n=[];return void 0!==t.url&&(s.push("url = ?"),n.push(t.url)),void 0!==t.caption&&(s.push("caption = ?"),n.push(t.caption)),void 0!==t.tags&&(s.push("tags = ?"),n.push(t.tags?JSON.stringify(t.tags):null)),void 0!==t.orderIndex&&(s.push("order_index = ?"),n.push(t.orderIndex)),void 0!==t.isPublic&&(s.push("is_public = ?"),n.push(t.isPublic)),n.push(e),await i.prepare(`
    UPDATE portfolio_images 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function p(e,t){let a=r(t);await a.prepare("DELETE FROM portfolio_images WHERE id = ?").bind(e).run()}function m(e){if(e?.R2_BUCKET)return e.R2_BUCKET;let t=globalThis[Symbol.for("__cloudflare-context__")],a=t?.env?.R2_BUCKET,r=globalThis.R2_BUCKET||globalThis.env?.R2_BUCKET,i=a||r;if(!i)throw Error("Cloudflare R2 binding (env.R2_BUCKET) is unavailable");return i}a.d(t,{Hf:()=>i,Ms:()=>m,Rw:()=>l,VK:()=>r,W0:()=>c,cP:()=>p,ce:()=>s,ep:()=>u,ex:()=>n,getArtistByUserId:()=>o,vB:()=>d,xd:()=>E})},32482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},18445:(e,t,a)=>{Object.defineProperty(t,"__esModule",{value:!0});var r={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s.default}});var i=a(32482);Object.keys(i).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(r,e))&&(e in t&&t[e]===i[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}}))});var s=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var a=n(void 0);if(a&&a.has(e))return a.get(e);var r={__proto__:null},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var o=i?Object.getOwnPropertyDescriptor(e,s):null;o&&(o.get||o.set)?Object.defineProperty(r,s,o):r[s]=e[s]}return r.default=e,a&&a.set(e,r),r}(a(4128));function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,a=new WeakMap;return(n=function(e){return e?a:t})(e)}Object.keys(s).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(r,e))&&(e in t&&t[e]===s[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return s[e]}}))})},74725:(e,t,a)=>{var r,i;a.d(t,{Z:()=>i,i:()=>r}),function(e){e.SUPER_ADMIN="SUPER_ADMIN",e.SHOP_ADMIN="SHOP_ADMIN",e.ARTIST="ARTIST",e.CLIENT="CLIENT"}(r||(r={})),function(e){e.PENDING="PENDING",e.CONFIRMED="CONFIRMED",e.IN_PROGRESS="IN_PROGRESS",e.COMPLETED="COMPLETED",e.CANCELLED="CANCELLED"}(i||(i={}))}};var t=require("../../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[9379,3670,4128,4833],()=>a(61871));module.exports=r})();