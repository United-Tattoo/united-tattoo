"use strict";(()=>{var e={};e.id=4887,e.ids=[4887,1035],e.modules={72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},27790:e=>{e.exports=require("assert")},78893:e=>{e.exports=require("buffer")},84770:e=>{e.exports=require("crypto")},17702:e=>{e.exports=require("events")},32615:e=>{e.exports=require("http")},35240:e=>{e.exports=require("https")},86624:e=>{e.exports=require("querystring")},17360:e=>{e.exports=require("url")},21764:e=>{e.exports=require("util")},71568:e=>{e.exports=require("zlib")},15431:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>T,patchFetch:()=>I,requestAsyncStorage:()=>m,routeModule:()=>f,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var r={};i.r(r),i.d(r,{GET:()=>_,dynamic:()=>E});var a=i(73278),s=i(45002),n=i(54877),o=i(71309),l=i(18445),u=i(33897),d=i(1035),p=i(29628);let c=p.z.object({path:p.z.string().default("/"),limit:p.z.string().transform(Number).optional(),offset:p.z.string().transform(Number).optional()}),E="force-dynamic";async function _(e,{params:t}={},i){try{if(!await (0,l.getServerSession)(u.Lz))return o.NextResponse.json({error:"Unauthorized"},{status:401});let{searchParams:t}=new URL(e.url),r=c.parse({path:t.get("path"),limit:t.get("limit"),offset:t.get("offset")}),a=(0,d.VK)(i?.env),s=`
      SELECT 
        fu.id,
        fu.filename as name,
        'file' as type,
        fu.size,
        fu.mime_type as mimeType,
        fu.url,
        fu.created_at as createdAt,
        '/' || fu.filename as path
      FROM file_uploads fu
      WHERE 1=1
    `,n=[];"/"!==r.path&&(s+=" AND fu.filename LIKE ?",n.push(`${r.path.replace("/","")}%`)),s+=" ORDER BY fu.created_at DESC",r.limit&&(s+=" LIMIT ?",n.push(r.limit),r.offset&&(s+=" OFFSET ?",n.push(r.offset)));let p=a.prepare(s),E=(await p.bind(...n).all()).results.map(e=>({...e,createdAt:new Date(e.createdAt)}));return o.NextResponse.json(E)}catch(e){return console.error("Files fetch error:",e),o.NextResponse.json({error:"Failed to fetch files"},{status:500})}}let f=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/files/route",pathname:"/api/files",filename:"route",bundlePath:"app/api/files/route"},resolvedPagePath:"/home/Nicholai/Documents/Dev/united_v03/united-tattoo/united-tattoo/app/api/files/route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:h}=f,T="/api/files/route";function I(){return(0,n.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}},33897:(e,t,i)=>{i.d(t,{Lz:()=>d,KR:()=>_,Z1:()=>p,GJ:()=>E,KN:()=>f,mk:()=>c});var r=i(22571),a=i(43016),s=i(76214),n=i(29628);let o=n.z.object({DATABASE_URL:n.z.string().url(),DIRECT_URL:n.z.string().url().optional(),NEXTAUTH_URL:n.z.string().url(),NEXTAUTH_SECRET:n.z.string().min(1),GOOGLE_CLIENT_ID:n.z.string().optional(),GOOGLE_CLIENT_SECRET:n.z.string().optional(),GITHUB_CLIENT_ID:n.z.string().optional(),GITHUB_CLIENT_SECRET:n.z.string().optional(),AWS_ACCESS_KEY_ID:n.z.string().min(1),AWS_SECRET_ACCESS_KEY:n.z.string().min(1),AWS_REGION:n.z.string().min(1),AWS_BUCKET_NAME:n.z.string().min(1),AWS_ENDPOINT_URL:n.z.string().url().optional(),NODE_ENV:n.z.enum(["development","production","test"]).default("development"),SMTP_HOST:n.z.string().optional(),SMTP_PORT:n.z.string().optional(),SMTP_USER:n.z.string().optional(),SMTP_PASSWORD:n.z.string().optional(),VERCEL_ANALYTICS_ID:n.z.string().optional()}),l=function(){try{return o.parse(process.env)}catch(e){if(e instanceof n.z.ZodError){let t=e.errors.map(e=>e.path.join(".")).join(", ");throw Error(`Missing or invalid environment variables: ${t}`)}throw e}}();var u=i(74725);let d={providers:[(0,s.Z)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(console.log("Authorize called with:",e),!e?.email||!e?.password)return console.log("Missing email or password"),null;if(console.log("Email received:",e.email),console.log("Password received:",e.password?"***":"empty"),"nicholai@biohazardvfx.com"===e.email)return console.log("Admin user recognized!"),{id:"admin-nicholai",email:"nicholai@biohazardvfx.com",name:"Nicholai",role:u.i.SUPER_ADMIN};console.log("Using fallback user creation");let t={id:"dev-user-"+Date.now(),email:e.email,name:e.email.split("@")[0],role:u.i.SUPER_ADMIN};return console.log("Created user:",t),t}}),...l.GOOGLE_CLIENT_ID&&l.GOOGLE_CLIENT_SECRET?[(0,r.Z)({clientId:l.GOOGLE_CLIENT_ID,clientSecret:l.GOOGLE_CLIENT_SECRET})]:[],...l.GITHUB_CLIENT_ID&&l.GITHUB_CLIENT_SECRET?[(0,a.Z)({clientId:l.GITHUB_CLIENT_ID,clientSecret:l.GITHUB_CLIENT_SECRET})]:[]],session:{strategy:"jwt",maxAge:2592e3},callbacks:{jwt:async({token:e,user:t,account:i})=>(t&&(e.role=t.role||u.i.CLIENT,e.userId=t.id),e),session:async({session:e,token:t})=>(t&&(e.user.id=t.userId,e.user.role=t.role),e),signIn:async({user:e,account:t,profile:i})=>!0,redirect:async({url:e,baseUrl:t})=>e.startsWith("/")?`${t}${e}`:new URL(e).origin===t?e:`${t}/admin`},pages:{signIn:"/auth/signin",error:"/auth/error"},events:{async signIn({user:e,account:t,profile:i,isNewUser:r}){console.log(`User ${e.email} signed in`)},async signOut({session:e,token:t}){console.log("User signed out")}},debug:"development"===l.NODE_ENV};async function p(){let{getServerSession:e}=await i.e(4128).then(i.bind(i,4128));return e(d)}async function c(e){let t=await p();if(!t)throw Error("Authentication required");if(e&&!function(e,t){let i={[u.i.CLIENT]:0,[u.i.ARTIST]:1,[u.i.SHOP_ADMIN]:2,[u.i.SUPER_ADMIN]:3};return i[e]>=i[t]}(t.user.role,e))throw Error("Insufficient permissions");return t}function E(e){return e===u.i.SHOP_ADMIN||e===u.i.SUPER_ADMIN}async function _(){let e=await p();if(!e?.user)return null;let t=e.user.role;if(t!==u.i.ARTIST&&!E(t))return null;let{getArtistByUserId:r}=await i.e(1035).then(i.bind(i,1035)),a=await r(e.user.id);return a?{artist:a,user:e.user}:null}async function f(){let e=await _();if(!e)throw Error("Artist authentication required");return e}},1035:(e,t,i)=>{function r(e){if(e?.DB)return e.DB;let t=globalThis[Symbol.for("__cloudflare-context__")],i=t?.env?.DB,r=globalThis.DB||globalThis.env?.DB,a=i||r;if(!a)throw Error("Cloudflare D1 binding (env.DB) is unavailable");return a}async function a(e,t){let i=r(t),a=`
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
  `,s=[];e?.specialty&&(a+=" AND a.specialties LIKE ?",s.push(`%${e.specialty}%`)),e?.search&&(a+=" AND (a.name LIKE ? OR a.bio LIKE ?)",s.push(`%${e.search}%`,`%${e.search}%`)),a+=" ORDER BY a.created_at DESC",e?.limit&&(a+=" LIMIT ?",s.push(e.limit)),e?.offset&&(a+=" OFFSET ?",s.push(e.offset));let n=await i.prepare(a).bind(...s).all();return await Promise.all(n.results.map(async e=>{let t=await i.prepare(`
        SELECT * FROM portfolio_images 
        WHERE artist_id = ? AND is_public = 1
        ORDER BY order_index ASC, created_at DESC
      `).bind(e.id).all();return{id:e.id,slug:e.slug,name:e.name,bio:e.bio,specialties:e.specialties?JSON.parse(e.specialties):[],instagramHandle:e.instagram_handle,isActive:!!e.is_active,hourlyRate:e.hourly_rate,portfolioImages:t.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)}))}}))}async function s(e,t){let i=r(t),a=await i.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ?
  `).bind(e).first();if(!a)return null;let s=await i.prepare(`
    SELECT * FROM portfolio_images 
    WHERE artist_id = ?
    ORDER BY order_index ASC, created_at DESC
  `).bind(e).all();return{id:a.id,userId:a.user_id,slug:a.slug,name:a.name,bio:a.bio,specialties:a.specialties?JSON.parse(a.specialties):[],instagramHandle:a.instagram_handle,isActive:!!a.is_active,hourlyRate:a.hourly_rate,portfolioImages:s.results.map(e=>({id:e.id,artistId:e.artist_id,url:e.url,caption:e.caption,tags:e.tags?JSON.parse(e.tags):[],orderIndex:e.order_index,isPublic:!!e.is_public,createdAt:new Date(e.created_at)})),availability:[],createdAt:new Date(a.created_at),updatedAt:new Date(a.updated_at),user:{name:a.user_name,email:a.user_email,avatar:a.user_avatar}}}async function n(e,t){let i=r(t),a=await i.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email,
      u.avatar as user_avatar
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.slug = ?
  `).bind(e).first();return a?s(a.id,t):null}async function o(e,t){let i=r(t),a=await i.prepare(`
    SELECT 
      a.*,
      u.name as user_name,
      u.email as user_email
    FROM artists a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.user_id = ?
  `).bind(e).first();return a?{id:a.id,userId:a.user_id,slug:a.slug,name:a.name,bio:a.bio,specialties:a.specialties?JSON.parse(a.specialties):[],instagramHandle:a.instagram_handle,isActive:!!a.is_active,hourlyRate:a.hourly_rate,portfolioImages:[],availability:[],createdAt:new Date(a.created_at),updatedAt:new Date(a.updated_at)}:null}async function l(e,t){let i=r(t),a=crypto.randomUUID(),s=e.userId;if(!s){let t=await i.prepare(`
      INSERT INTO users (id, email, name, role)
      VALUES (?, ?, ?, 'ARTIST')
      RETURNING id
    `).bind(crypto.randomUUID(),e.email||`${e.name.toLowerCase().replace(/\s+/g,".")}@unitedtattoo.com`,e.name).first();s=t?.id}return await i.prepare(`
    INSERT INTO artists (id, user_id, name, bio, specialties, instagram_handle, hourly_rate, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(a,s,e.name,e.bio,JSON.stringify(e.specialties),e.instagramHandle||null,e.hourlyRate||null,!1!==e.isActive).first()}async function u(e,t,i){let a=r(i),s=[],n=[];return void 0!==t.name&&(s.push("name = ?"),n.push(t.name)),void 0!==t.bio&&(s.push("bio = ?"),n.push(t.bio)),void 0!==t.specialties&&(s.push("specialties = ?"),n.push(JSON.stringify(t.specialties))),void 0!==t.instagramHandle&&(s.push("instagram_handle = ?"),n.push(t.instagramHandle)),void 0!==t.hourlyRate&&(s.push("hourly_rate = ?"),n.push(t.hourlyRate)),void 0!==t.isActive&&(s.push("is_active = ?"),n.push(t.isActive)),s.push("updated_at = CURRENT_TIMESTAMP"),n.push(e),await a.prepare(`
    UPDATE artists 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function d(e,t){let i=r(t);await i.prepare("UPDATE artists SET is_active = 0 WHERE id = ?").bind(e).run()}async function p(e,t,i){let a=r(i),s=crypto.randomUUID();return await a.prepare(`
    INSERT INTO portfolio_images (id, artist_id, url, caption, tags, order_index, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `).bind(s,e,t.url,t.caption||null,t.tags?JSON.stringify(t.tags):null,t.orderIndex||0,!1!==t.isPublic).first()}async function c(e,t,i){let a=r(i),s=[],n=[];return void 0!==t.url&&(s.push("url = ?"),n.push(t.url)),void 0!==t.caption&&(s.push("caption = ?"),n.push(t.caption)),void 0!==t.tags&&(s.push("tags = ?"),n.push(t.tags?JSON.stringify(t.tags):null)),void 0!==t.orderIndex&&(s.push("order_index = ?"),n.push(t.orderIndex)),void 0!==t.isPublic&&(s.push("is_public = ?"),n.push(t.isPublic)),n.push(e),await a.prepare(`
    UPDATE portfolio_images 
    SET ${s.join(", ")}
    WHERE id = ?
    RETURNING *
  `).bind(...n).first()}async function E(e,t){let i=r(t);await i.prepare("DELETE FROM portfolio_images WHERE id = ?").bind(e).run()}function _(e){if(e?.R2_BUCKET)return e.R2_BUCKET;let t=globalThis[Symbol.for("__cloudflare-context__")],i=t?.env?.R2_BUCKET,r=globalThis.R2_BUCKET||globalThis.env?.R2_BUCKET,a=i||r;if(!a)throw Error("Cloudflare R2 binding (env.R2_BUCKET) is unavailable");return a}i.d(t,{Hf:()=>a,Ms:()=>_,Rw:()=>l,VK:()=>r,W0:()=>c,cP:()=>E,ce:()=>s,ep:()=>u,ex:()=>n,getArtistByUserId:()=>o,vB:()=>d,xd:()=>p})},32482:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0})},18445:(e,t,i)=>{Object.defineProperty(t,"__esModule",{value:!0});var r={};Object.defineProperty(t,"default",{enumerable:!0,get:function(){return s.default}});var a=i(32482);Object.keys(a).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(r,e))&&(e in t&&t[e]===a[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return a[e]}}))});var s=function(e,t){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var i=n(void 0);if(i&&i.has(e))return i.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var s in e)if("default"!==s&&({}).hasOwnProperty.call(e,s)){var o=a?Object.getOwnPropertyDescriptor(e,s):null;o&&(o.get||o.set)?Object.defineProperty(r,s,o):r[s]=e[s]}return r.default=e,i&&i.set(e,r),r}(i(4128));function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,i=new WeakMap;return(n=function(e){return e?i:t})(e)}Object.keys(s).forEach(function(e){!("default"===e||"__esModule"===e||Object.prototype.hasOwnProperty.call(r,e))&&(e in t&&t[e]===s[e]||Object.defineProperty(t,e,{enumerable:!0,get:function(){return s[e]}}))})},74725:(e,t,i)=>{var r,a;i.d(t,{Z:()=>a,i:()=>r}),function(e){e.SUPER_ADMIN="SUPER_ADMIN",e.SHOP_ADMIN="SHOP_ADMIN",e.ARTIST="ARTIST",e.CLIENT="CLIENT"}(r||(r={})),function(e){e.PENDING="PENDING",e.CONFIRMED="CONFIRMED",e.IN_PROGRESS="IN_PROGRESS",e.COMPLETED="COMPLETED",e.CANCELLED="CANCELLED"}(a||(a={}))}};var t=require("../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),r=t.X(0,[9379,3670,4128,4833],()=>i(15431));module.exports=r})();