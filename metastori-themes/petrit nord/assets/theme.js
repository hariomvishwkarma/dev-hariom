!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t=t||self).window=t.window||{})}(this,function(e){"use strict";function _inheritsLoose(t,e){t.prototype=Object.create(e.prototype),(t.prototype.constructor=t).__proto__=e}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t} /*! * GSAP 3.0.1 * https://greensock.com * * @license Copyright 2008-2019, GreenSock. All rights reserved. * Subject to the terms at https://greensock.com/standard-license or for * Club GreenSock members, the agreement issued with that membership. * @author: Jack Doyle, jack@greensock.com */function n(t){return"string"==typeof t}function o(t){return"function"==typeof t}function p(t){return"number"==typeof t}function q(t){return void 0===t}function r(t){return"object"==typeof t}function s(t){return!1!==t}function t(){return"undefined"!=typeof window}function u(t){return o(t)||n(t)}function J(t){return(l=dt(t,at))&&ee}function K(t,e){return console.warn("Invalid",t,"tween of",e,"Missing plugin? gsap.registerPlugin()")}function L(t,e){return!e&&console.warn(t)}function M(t,e){return t&&(at[t]=e)&&l&&(l[t]=e)||at}function N(){return 0}function W(t){var e,n,i=t[0];if(!r(i)&&!o(i))return G(t)?t:[t];if(!(e=(i._gsap||{}).harness)){for(n=ct.length;n--&&!ct[n].targetTest(i););e=ct[n]}for(n=t.length;n--;)t[n]._gsap||(t[n]._gsap=new Ft(t[n],e));return t}function X(t){return t._gsap||W(vt(t))[0]._gsap}function Y(t,e){var r=t[e];return o(r)?t[e]():q(r)&&t.getAttribute(e)||r}function Z(t,e){return(t=t.split(",")).forEach(e)||t}function $(t){return Math.round(1e4*t)/1e4}function _(t,e){for(var r=e.length,n=0;t.indexOf(e[n])<0&&++n<r;);return n<r}function aa(t,e,r){var n,i=p(t[1]),a=(i?2:1)+(e<2?0:1),o=t[a];return i&&(o.duration=t[1]),1===e?(o.runBackwards=1,o.immediateRender=s(o.immediateRender)):2===e&&(n=t[a-1],o.startAt=n,o.immediateRender=s(o.immediateRender)),o.parent=r,o}function ba(){var t,e,r=ot.length,n=ot.slice(0);for(ut={},t=ot.length=0;t<r;t++)(e=n[t])&&e._lazy&&(e.render(e._lazy[0],e._lazy[1],!0)._lazy=0)}function ca(t,e,r,n){ot.length&&ba(),t.render(e,r,n),ot.length&&ba()}function da(t){var e=parseFloat(t);return e||0===e?e:t}function ea(t){return t}function fa(t,e){for(var r in e)r in t||(t[r]=e[r]);return t}function ga(t,e){for(var r in e)r in t||"duration"===r||"ease"===r||(t[r]=e[r])}function ia(t,e){for(var n in e)t[n]=r(e[n])?ia(t[n]||(t[n]={}),e[n]):e[n];return t}function ja(t,e){var r,n={};for(r in t)r in e||(n[r]=t[r]);return n}function na(t,e,r,n){void 0===r&&(r="_first"),void 0===n&&(n="_last");var i=e._prev,a=e._next;i?i._next=a:t[r]===e&&(t[r]=a),a?a._prev=i:t[n]===e&&(t[n]=i),e._dp=t,e._next=e._prev=e.parent=null}function oa(t,e){!t.parent||e&&!t.parent.autoRemoveChildren||t.parent.remove(t),t._act=0}function pa(t){for(var e=t;e;)e._dirty=1,e=e.parent;return t}function sa(t){var e;return t._repeat?(e=t.duration()+t._rDelay)*~~(t._tTime/e):0}function ta(t,e){return 0<e._ts?(t-e._start)*e._ts:(e._dirty?e.totalDuration():e._tDur)+(t-e._start)*e._ts}function ua(t,e,r){if(e.parent&&oa(e),e._start=r+e._delay,e._end=e._start+(e.totalDuration()/e._ts||0),function _addLinkedListItem(t,e,r,n,i){void 0===r&&(r="_first"),void 0===n&&(n="_last");var a,s=t[n];if(i)for(a=e[i];s&&s[i]>a;)s=s._prev;s?(e._next=s._next,s._next=e):(e._next=t[r],t[r]=e),e._next?e._next._prev=e:t[n]=e,e._prev=s,e.parent=t}(t,e,"_first","_last",t._sort?"_start":0),(t._recent=e)._time||!e._dur&&e._initted){var n=(t.rawTime()-e._start)*e._ts;(!e._dur||mt(0,e.totalDuration(),n)-e._tTime>B)&&e.render(n,!0)}if(pa(t),t._dp&&t._time>=t._dur&&t._ts&&t._dur<t.duration())for(var i=t;i._dp;)i.totalTime(i._tTime,!0),i=i._dp;return t}function va(t,e,r,n){return It(t,e),t._initted?!r&&t._pt&&t.vars.lazy?(ot.push(t),t._lazy=[e,n],1):void 0:1}function ya(t){if(t instanceof Et)return pa(t);var e=t._repeat;return t._tDur=e?e<0?1e20:$(t._dur*(e+1)+t._rDelay*e):t._dur,pa(t.parent),t}function Aa(t,e){var r,i,a=t.labels,s=t._recent||_t,o=t.duration()>=D?s.endTime(!1):t._dur;return n(e)&&(isNaN(e)||e in a)?"<"===(r=e.charAt(0))||">"===r?("<"===r?s._start:s.endTime(0<=s._repeat))+(parseFloat(e.substr(1))||0):(r=e.indexOf("="))<0?(e in a||(a[e]=o),a[e]):(i=+(e.charAt(r-1)+e.substr(r+1)),1<r?Aa(t,e.substr(0,r-1))+i:o+i):null==e?o:+e}function Ba(t,e){return t||0===t?e(t):e}function Da(t){return(t+"").substr((parseFloat(t)+"").length)}function Ga(t){return r(t)&&"length"in t&&t.length-1 in t&&r(t[0])&&t!==i}function Ja(t){if(o(t))return t;var d=r(t)?t:{each:t},_=Dt(d.ease),m=d.from||0,g=parseFloat(d.base)||0,v={},e=0<m&&m<1,y=isNaN(m)||e,b=d.axis,w=m,T=m;return n(m)?w=T={center:.5,edges:.5,end:1}[m]||0:!e&&y&&(w=m[0],T=m[1]),function(t,e,r){var n,i,a,s,o,u,h,l,f,c=(r||d).length,p=v[c];if(!p){if(!(f="auto"===d.grid?0:(d.grid||[1,D])[1])){for(h=-D;h<(h=r[f++].getBoundingClientRect().left)&&f<c;);f--}for(p=v[c]=[],n=y?Math.min(f,c)*w-.5:m%f,i=y?c*T/f-.5:m/f|0,l=D,u=h=0;u<c;u++)a=u%f-n,s=i-(u/f|0),p[u]=o=b?Math.abs("y"===b?s:a):j(a*a+s*s),h<o&&(h=o),o<l&&(l=o);p.max=h-l,p.min=l,p.v=c=(parseFloat(d.amount)||parseFloat(d.each)*(c<f?c-1:b?"y"===b?c/f:f:Math.max(f,c/f))||0)*("edges"===m?-1:1),p.b=c<0?g-c:g,p.u=Da(d.amount||d.each)||0,_=_&&c<0?Ct(_):_}return c=(p[t]-p.min)/p.max||0,$(p.b+(_?_(c):c)*p.v)+p.u}}function Ka(e){var r=e<1?Math.pow(10,(e+"").length-2):1;return function(t){return~~(Math.round(parseFloat(t)/e)*e*r)/r+(p(t)?0:Da(t))}}function La(u,t){var h,l,e=G(u);return!e&&r(u)&&(h=e=u.radius||D,u=vt(u.values),(l=!p(u[0]))&&(h*=h)),Ba(t,e?function(t){for(var e,r,n=parseFloat(l?t.x:t),i=parseFloat(l?t.y:0),a=D,s=0,o=u.length;o--;)(e=l?(e=u[o].x-n)*e+(r=u[o].y-i)*r:Math.abs(u[o]-n))<a&&(a=e,s=o);return s=!h||a<=h?u[s]:t,l||s===t||p(t)?s:s+Da(t)}:Ka(u))}function Ma(t,e,r,n){return Ba(G(t)?!e:!n,function(){return G(t)?t[~~(Math.random()*t.length)]:(r=r||1e-5)&&(n=r<1?Math.pow(10,(r+"").length-2):1)&&~~(Math.round((t+Math.random()*(e-t))/r)*r*n)/n})}function Qa(e,r,t){return Ba(t,function(t){return e[~~r(t)]})}function Ta(t){for(var e,r,n,i,a=0,s="";~(e=t.indexOf("random(",a));)n=t.indexOf(")",e),i="["===t.charAt(e+7),r=t.substr(e+7,n-e-7).match(i?it:H),s+=t.substr(a,e-a)+Ma(i?r:+r[0],+r[1],+r[2]||1e-5),a=n+1;return s+t.substr(a,t.length-a)}function Wa(t,e,r){var n,i,a,s=t.labels,o=D;for(n in s)(i=s[n]-e)<0==!!r&&i&&o>(i=Math.abs(i))&&(a=n,o=i);return a}function Ya(t){return oa(t),t.progress()<1&&bt(t,"onInterrupt"),t}function bb(t,e,r){return(6*(t=t<0?t+1:1<t?t-1:t)<1?e+(r-e)*t*6:t<.5?r:3*t<2?e+(r-e)*(2/3-t)*6:e)*wt+.5|0}function cb(t,e){var r,n,i,a,s,o,u,h,l,f,c=t?p(t)?[t>>16,t>>8&wt,t&wt]:0:Tt.black;if(!c){if(","===t.substr(-1)&&(t=t.substr(0,t.length-1)),Tt[t])c=Tt[t];else if("#"===t.charAt(0))4===t.length&&(t="#"+(r=t.charAt(1))+r+(n=t.charAt(2))+n+(i=t.charAt(3))+i),c=[(t=parseInt(t.substr(1),16))>>16,t>>8&wt,t&wt];else if("hsl"===t.substr(0,3))if(c=f=t.match(H),e){if(~t.indexOf("="))return t.match(tt)}else a=+c[0]%360/360,s=+c[1]/100,r=2*(o=+c[2]/100)-(n=o<=.5?o*(s+1):o+s-o*s),3<c.length&&(c[3]*=1),c[0]=bb(a+1/3,r,n),c[1]=bb(a,r,n),c[2]=bb(a-1/3,r,n);else c=t.match(H)||Tt.transparent;c=c.map(Number)}return e&&!f&&(r=c[0]/wt,n=c[1]/wt,i=c[2]/wt,o=((u=Math.max(r,n,i))+(h=Math.min(r,n,i)))/2,u===h?a=s=0:(l=u-h,s=.5<o?l/(2-u-h):l/(u+h),a=u===r?(n-i)/l+(n<i?6:0):u===n?(i-r)/l+2:(r-n)/l+4,a*=60),c[0]=a+.5|0,c[1]=100*s+.5|0,c[2]=100*o+.5|0),c}function db(t,e){var r,n,i,a=(t+"").match(xt),s=0,o="";if(!a)return t;for(r=0;r<a.length;r++)n=a[r],s+=(i=t.substr(s,t.indexOf(n,s)-s)).length+n.length,3===(n=cb(n,e)).length&&n.push(1),o+=i+(e?"hsla("+n[0]+","+n[1]+"%,"+n[2]+"%,"+n[3]:"rgba("+n.join(","))+")";return o+t.substr(s)}function gb(t){var e,r=t.join(" ");xt.lastIndex=0,xt.test(r)&&(e=kt.test(r),t[0]=db(t[0],e),t[1]=db(t[1],e))}function ob(t){var e=(t+"").split("("),r=Ot[e[0]];return r&&1<e.length&&r.config?r.config.apply(null,~t.indexOf("{")?[function _parseObjectInString(t){for(var e,r,n,i={},a=t.substr(1,t.length-3).split(":"),s=a[0],o=1,u=a.length;o<u;o++)r=a[o],e=o!==u-1?r.lastIndexOf(","):r.length,n=r.substr(0,e),i[s]=isNaN(n)?n.replace(St,"").trim():+n,s=r.substr(e+1).trim();return i}(e[1])]:rt.exec(t)[1].split(",").map(da)):Ot._CE&&Pt.test(t)?Ot._CE("",t):r}function rb(t,e,r,n){void 0===r&&(r=function easeOut(t){return 1-e(1-t)}),void 0===n&&(n=function easeInOut(t){return t<.5?e(2*t)/2:1-e(2*(1-t))/2});var i,a={easeIn:e,easeOut:r,easeInOut:n};return Z(t,function(t){for(var e in Ot[t]=at[t]=a,Ot[i=t.toLowerCase()]=r,a)Ot[i+("easeIn"===e?".in":"easeOut"===e?".out":".inOut")]=Ot[t+"."+e]=a[e]}),a}function sb(e){return function(t){return t<.5?(1-e(1-2*t))/2:.5+e(2*(t-.5))/2}}function tb(r,t,e){function sk(t){return 1===t?1:n*Math.pow(2,-10*t)*Q((t-a)*i)+1}var n=1<=t?t:1,i=(e||(r?.3:.45))/(t<1?t:1),a=i/F*(Math.asin(1/n)||0),s="out"===r?sk:"in"===r?function(t){return 1-sk(1-t)}:sb(sk);return i=F/i,s.config=function(t,e){return tb(r,t,e)},s}function ub(e,r){function Ak(t){return--t*t*((r+1)*t+r)+1}void 0===r&&(r=1.70158);var t="out"===e?Ak:"in"===e?function(t){return 1-Ak(1-t)}:sb(Ak);return t.config=function(t){return ub(e,t)},t}var R,i,a,h,l,f,d,c,m,g,v,y,b,w,T,x,k,A,O,P,S,C,U={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},E={duration:.5,overwrite:!1,delay:0},D=1e8,B=1/D,F=2*Math.PI,z=F/4,I=0,j=Math.sqrt,V=Math.cos,Q=Math.sin,G=Array.isArray,H=/(?:-?\.?\d|\.)+/gi,tt=/[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,et=/[-+=\.]*\d+(?:\.|e-|e)*\d*/gi,rt=/\(([^()]+)\)/i,nt=/[\+-]=-?[\.\d]+/,it=/[#\-+\.]*\b[a-z\d-=+%.]+/gi,at={},st={},ot=[],ut={},ht={},lt={},ft=30,ct=[],pt="onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",dt=function _merge(t,e){for(var r in e)t[r]=e[r];return t},_t={_start:0,endTime:N},mt=function _clamp(t,e,r){return r<t?t:e<r?e:r},gt=[].slice,vt=function toArray(t,e){return!n(t)||e||!a&&Mt()?G(t)?function _flatten(t,r,i){return void 0===i&&(i=[]),t.forEach(function(t){var e;return n(t)&&!r||Ga(t)?(e=i).push.apply(e,vt(t)):i.push(t)})||i}(t,e):Ga(t)?gt.call(t,0):t?[t]:[]:gt.call(h.querySelectorAll(t),0)},yt=function mapRange(e,t,r,n,i){var a=t-e,s=n-r;return Ba(i,function(t){return r+(t-e)/a*s})},bt=function _callback(t,e,r){var n,i,a=t.vars,s=a[e];if(s)return n=a[e+"Params"],i=a.callbackScope||t,r&&ot.length&&ba(),n?s.apply(i,n):s.call(i,t)},wt=255,Tt={aqua:[0,wt,wt],lime:[0,wt,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,wt],navy:[0,0,128],white:[wt,wt,wt],olive:[128,128,0],yellow:[wt,wt,0],orange:[wt,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[wt,0,0],pink:[wt,192,203],cyan:[0,wt,wt],transparent:[wt,wt,wt,0]},xt=function(){var t,e="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b";for(t in Tt)e+="|"+t+"\\b";return new RegExp(e+")","gi")}(),kt=/hsl[a]?\(/,At=(b=Date.now,w=500,T=33,x=b(),k=x,O=A=1/60,y={time:0,frame:0,tick:function tick(){yj(!0)},wake:function wake(){f&&(!a&&t()&&(i=a=window,h=i.document||{},at.gsap=ee,(i.gsapVersions||(i.gsapVersions=[])).push(ee.version),J(l||i.GreenSockGlobals||!i.gsap&&i||{}),v=i.requestAnimationFrame),m&&y.sleep(),g=v||function(t){return setTimeout(t,1e3*(O-y.time)+1|0)},c=1,yj(2))},sleep:function sleep(){(v?i.cancelAnimationFrame:clearTimeout)(m),c=0,g=N},lagSmoothing:function lagSmoothing(t,e){w=t||1e8,T=Math.min(e,w,0)},fps:function fps(t){A=1/(t||60),O=y.time+A},add:function add(t){P.indexOf(t)<0&&P.push(t),Mt()},remove:function remove(t){var e;~(e=P.indexOf(t))&&P.splice(e,1)},_listeners:P=[]}),Mt=function _wake(){return!c&&At.wake()},Ot={},Pt=/^[\d.\-M][\d.\-,\s]/,St=/["']/g,Ct=function _invertEase(e){return function(t){return 1-e(1-t)}},Dt=function _parseEase(t,e){return t&&(o(t)?t:Ot[t]||ob(t))||e};function yj(e){var t,r,n=b()-k,i=!0===e;w<n&&(x+=n-T),k+=n,y.time=(k-x)/1e3,(0<(t=y.time-O)||i)&&(y.frame++,O+=t+(A<=t?.004:A-t),r=1),i||(m=g(yj)),r&&P.forEach(function(t){return t(y.time,n,y.frame,e)})}function Rk(t){return t<C?S*t*t:t<.7272727272727273?S*Math.pow(t-1.5/2.75,2)+.75:t<.9090909090909092?S*(t-=2.25/2.75)*t+.9375:S*Math.pow(t-2.625/2.75,2)+.984375}Z("Linear,Quad,Cubic,Quart,Quint,Strong",function(t,e){var r=e<5?e+1:e;rb(t+",Power"+(r-1),e?function(t){return Math.pow(t,r)}:function(t){return t},function(t){return 1-Math.pow(1-t,r)},function(t){return t<.5?Math.pow(2*t,r)/2:1-Math.pow(2*(1-t),r)/2})}),Ot.Linear.easeNone=Ot.none=Ot.Linear.easeIn,rb("Elastic",tb("in"),tb("out"),tb()),S=7.5625,C=1/2.75,rb("Bounce",function(t){return 1-Rk(1-t)},Rk),rb("Expo",function(t){return t?Math.pow(2,10*(t-1)):0}),rb("Circ",function(t){return-(j(1-t*t)-1)}),rb("Sine",function(t){return 1-V(t*z)}),rb("Back",ub("in"),ub("out"),ub()),Ot.SteppedEase=Ot.steps=at.SteppedEase={config:function config(t,e){void 0===t&&(t=1);var r=1/t,n=t+(e?0:1),i=e?1:0;return function(t){return((n*mt(0,.99999999,t)|0)+i)*r}}},E.ease=Ot["quad.out"];var Bt,Ft=function GSCache(t,e){this.id=I++,(t._gsap=this).target=t,this.harness=e,this.get=e?e.get:Y,this.set=e?e.getSetter:jt},Rt=((Bt=Animation.prototype).delay=function delay(t){return t||0===t?(this._delay=t,this):this._delay},Bt.duration=function duration(t){var e=arguments.length,r=this._repeat,n=0<r?r*((e?t:this._dur)+this._rDelay):0;return e?this.totalDuration(r<0?t:t+n):this.totalDuration()&&this._dur},Bt.totalDuration=function totalDuration(t){if(!arguments.length)return this._tDur;var e=this._repeat,r=(t||this._rDelay)&&e<0;return this._tDur=r?1e20:t,this._dur=r?t:(t-e*this._rDelay)/(e+1),this._dirty=0,pa(this.parent),this},Bt.totalTime=function totalTime(t,e){if(Mt(),!arguments.length)return this._tTime;var r,n=this.parent||this._dp;if(n&&n.smoothChildTiming&&this._ts){for(r=this._start,this._start=n._time-(0<this._ts?t/this._ts:((this._dirty?this.totalDuration():this._tDur)-t)/-this._ts),this._end+=this._start-r,n._dirty||pa(n);n.parent;)n.parent._time!==n._start+(0<n._ts?n._tTime/n._ts:(n.totalDuration()-n._tTime)/-n._ts)&&n.totalTime(n._tTime,!0),n=n.parent;this.parent||ua(this._dp,this,this._start-this._delay)}return this._tTime===t&&this._dur||ca(this,t,e),this},Bt.time=function time(t,e){return arguments.length?this.totalTime(t+sa(this),e):this._time},Bt.totalProgress=function totalProgress(t,e){return arguments.length?this.totalTime(this.totalDuration()*t,e):this._tTime/this.totalDuration()},Bt.progress=function progress(t,e){return arguments.length?this.totalTime(this.duration()*t+sa(this),e):this.duration()?this._time/this._dur:this.ratio},Bt.iteration=function iteration(t,e){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(t-1)*r,e):this._repeat?1+~~(this._tTime/r):1},Bt.timeScale=function timeScale(t){var e=this._ts;return arguments.length?e?(this._end=this._start+this._tDur/(this._ts=t||B),function _recacheAncestors(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t}(this).totalTime(this._tTime,!0)):(this._pauseTS=t,this):e||this._pauseTS},Bt.paused=function paused(t){var e=!this._ts;return arguments.length?(e!==t&&(t?(this._pauseTS=this._ts,this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(this._ts=this._pauseTS,t=this._tTime||this._pTime,1===this.progress()&&(this._tTime-=B),this.totalTime(t,!0))),this):e},Bt.startTime=function startTime(t){return arguments.length?(this.parent&&this.parent._sort&&ua(this.parent,this,t-this._delay),this):this._start},Bt.endTime=function endTime(t){return this._start+(s(t)?this.totalDuration():this.duration())/Math.abs(this._ts)},Bt.rawTime=function rawTime(t){var e=this.parent||this._dp;return e?t&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?ta(e.rawTime(t),this):this._tTime:this._tTime},Bt.repeat=function repeat(t){return arguments.length?(this._repeat=t,ya(this)):this._repeat},Bt.repeatDelay=function repeatDelay(t){return arguments.length?(this._rDelay=t,ya(this)):this._rDelay},Bt.yoyo=function yoyo(t){return arguments.length?(this._yoyo=t,this):this._yoyo},Bt.seek=function seek(t,e){return this.totalTime(Aa(this,t),s(e))},Bt.restart=function restart(t,e){return this.play().totalTime(t?-this._delay:0,s(e))},Bt.play=function play(t,e){return null!=t&&this.seek(t,e),this.reversed(!1).paused(!1)},Bt.reverse=function reverse(t,e){return null!=t&&this.seek(t||this.totalDuration(),e),this.reversed(!0).paused(!1)},Bt.pause=function pause(t,e){return null!=t&&this.seek(t,e),this.paused(!0)},Bt.resume=function resume(){return this.paused(!1)},Bt.reversed=function reversed(t){var e=this._ts||this._pauseTS;return arguments.length?(t!==this.reversed()&&(this[this._ts?"_ts":"_pauseTS"]=Math.abs(e)*(t?-1:1),this.totalTime(this._tTime,!0)),this):e<0},Bt.invalidate=function invalidate(){return this._initted=0,this},Bt.isActive=function isActive(){var t,e=this.parent||this._dp,r=this._start;return!e||this._ts&&this._initted&&e.isActive()&&(t=e.rawTime(!0))>=r&&t<this.endTime(!0)-B},Bt.eventCallback=function eventCallback(t,e,r){var n=this.vars;return 1<arguments.length?(e?(n[t]=e,r&&(n[t+"Params"]=r),"onUpdate"===t&&(this._onUpdate=e)):delete n[t],this):n[t]},Bt.then=function then(e){var r=this;return void 0===e&&(e=N),new Promise(function(t){r._prom=function(){e(r),t()}})},Bt.kill=function kill(){Ya(this)},Animation);function Animation(t,e){var r=t.parent||R;this.vars=t,this._dur=this._tDur=+t.duration||0,this._delay=+t.delay||0,(this._repeat=t.repeat||0)&&(this._rDelay=t.repeatDelay||0,this._yoyo=!!t.yoyo||!!t.yoyoEase,ya(this)),this._ts=1,this.data=t.data,c||At.wake(),r&&ua(r,this,e||0===e?e:r._time),t.reversed&&this.reversed(!0),t.paused&&this.paused(!0)}fa(Rt.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:0,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-B,_prom:0});var Et=function(i){function Timeline(t,e){var r;return void 0===t&&(t={}),(r=i.call(this,t,e)||this).labels={},r.smoothChildTiming=s(t.smoothChildTiming),r.autoRemoveChildren=!!t.autoRemoveChildren,r._sort=s(t.sortChildren),r}_inheritsLoose(Timeline,i);var t=Timeline.prototype;return t.to=function to(t,e,r,n){return new Xt(t,aa(arguments,0,this),Aa(this,p(e)?n:r)),this},t.from=function from(t,e,r,n){return new Xt(t,aa(arguments,1,this),Aa(this,p(e)?n:r)),this},t.fromTo=function fromTo(t,e,r,n,i){return new Xt(t,aa(arguments,2,this),Aa(this,p(e)?i:n)),this},t.set=function set(t,e,r){return e.duration=0,e.parent=this,e.repeatDelay||(e.repeat=0),e.immediateRender=!!e.immediateRender,new Xt(t,e,Aa(this,r)),this},t.call=function call(t,e,r){return ua(this,Xt.delayedCall(0,t,e),Aa(this,r))},t.staggerTo=function staggerTo(t,e,r,n,i,a,s){return r.duration=e,r.stagger=r.stagger||n,r.onComplete=a,r.onCompleteParams=s,r.parent=this,new Xt(t,r,Aa(this,i)),this},t.staggerFrom=function staggerFrom(t,e,r,n,i,a,o){return r.runBackwards=1,r.immediateRender=s(r.immediateRender),this.staggerTo(t,e,r,n,i,a,o)},t.staggerFromTo=function staggerFromTo(t,e,r,n,i,a,o,u){return n.startAt=r,n.immediateRender=s(n.immediateRender),this.staggerTo(t,e,n,i,a,o,u)},t.render=function render(t,e,r){var n,i,a,s,o,u,h,l,f,c,p,d=this._time,_=this._dirty?this.totalDuration():this._tDur,m=this._dur,g=_-B<t&&0<=t&&this!==R?_:t<B?0:t,v=this._zTime<0!=t<0&&this._initted;if(g!==this._tTime||r||v){if(v&&(m||(d=this._zTime),!t&&e||(this._zTime=t)),n=g,f=this._start,u=0===(l=this._ts),d!==this._time&&m&&(n+=this._time-d),this._repeat&&(p=this._yoyo,o=m+this._rDelay,(m<(n=$(g%o))||_===g)&&(n=m),(s=~~(g/o))&&s===g/o&&(n=m,s--),(c=~~(this._tTime/o))&&c===this._tTime/o&&c--,p&&1&s&&(n=m-n),s!==c&&!this._lock)){var y=p&&1&c,b=y===(p&&1&s);if(s<c&&(y=!y),d=y?0:m,this._lock=1,this.render(d,e,!m)._lock=0,!e&&this.parent&&bt(this,"onRepeat"),d!==this._time||u!=!this._ts)return this;if(b&&(this._lock=2,d=y?m+1e-4:-1e-4,this.render(d,!0)),this._lock=0,!this._ts&&!u)return this}if(this._hasPause&&!this._forcing&&this._lock<2&&(h=function _findNextPauseTween(t,e,r){var n;if(e<r)for(n=t._first;n&&n._start<=r;){if(!n._dur&&"isPause"===n.data&&n._start>e)return n;n=n._next}else for(n=t._last;n&&n._start>=r;){if(!n._dur&&"isPause"===n.data&&n._start<e)return n;n=n._prev}}(this,$(d),$(n)))&&(g-=n-(n=h._start)),this._tTime=g,this._time=n,this._act=!l,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1),d||!n||e||bt(this,"onStart"),d<=n&&0<=t)for(i=this._first;i;){if(a=i._next,(i._act||n>=i._start)&&i._ts&&h!==i){if(i.parent!==this)return this.render(t,e,r);if(i.render(0<i._ts?(n-i._start)*i._ts:(i._dirty?i.totalDuration():i._tDur)+(n-i._start)*i._ts,e,r),n!==this._time||!this._ts&&!u){h=0;break}}i=a}else{i=this._last;for(var w=t<0?t:n;i;){if(a=i._prev,(i._act||w<=i._end)&&i._ts&&h!==i){if(i.parent!==this)return this.render(t,e,r);if(i.render(0<i._ts?(w-i._start)*i._ts:(i._dirty?i.totalDuration():i._tDur)+(w-i._start)*i._ts,e,r),n!==this._time||!this._ts&&!u){h=0;break}}i=a}}if(h&&!e&&(this.pause(),h.render(d<=n?0:-B)._zTime=d<=n?1:-1,this._ts))return this._start=f,this.render(t,e,r);this._onUpdate&&!e&&bt(this,"onUpdate",!0),(g===_||!g&&this._ts<0)&&(f!==this._start&&Math.abs(l)===Math.abs(this._ts)||(!n||_>=this.totalDuration())&&(!t&&m||oa(this,1),e||t<0&&!d||(bt(this,g===_?"onComplete":"onReverseComplete",!0),this._prom&&g===_&&this._prom())))}return this},t.add=function add(t,e){var r=this;if(p(e)||(e=Aa(this,e)),!(t instanceof Rt)){if(G(t))return t.forEach(function(t){return r.add(t,e)}),pa(this);if(n(t))return this.addLabel(t,e);if(!o(t))return this;t=Xt.delayedCall(0,t)}return this!==t?ua(this,t,e):this},t.getChildren=function getChildren(t,e,r,n){void 0===t&&(t=!0),void 0===e&&(e=!0),void 0===r&&(r=!0),void 0===n&&(n=-D);for(var i=[],a=this._first;a;)a._start>=n&&(a instanceof Xt?e&&i.push(a):(r&&i.push(a),t&&i.push.apply(i,a.getChildren(!0,e,r)))),a=a._next;return i},t.getById=function getById(t){for(var e=this.getChildren(1,1,1),r=e.length;r--;)if(e[r].vars.id===t)return e[r]},t.remove=function remove(t){return n(t)?this.removeLabel(t):o(t)?this.killTweensOf(t):(na(this,t),t===this._recent&&(this._recent=this._last),pa(this))},t.totalTime=function totalTime(t,e){return arguments.length?(this._forcing=1,this.parent||this._dp||!this._ts||(this._start=At.time-(0<this._ts?t/this._ts:(this.totalDuration()-t)/-this._ts)),i.prototype.totalTime.call(this,t,e),this._forcing=0,this):this._tTime},t.addLabel=function addLabel(t,e){return this.labels[t]=Aa(this,e),this},t.removeLabel=function removeLabel(t){return delete this.labels[t],this},t.addPause=function addPause(t,e,r){var n=Xt.delayedCall(0,e||N,r);return n.data="isPause",this._hasPause=1,ua(this,n,Aa(this,t))},t.removePause=function removePause(t){var e=this._first;for(t=Aa(this,t);e;)e._start===t&&"isPause"===e.data&&oa(e),e=e._next},t.killTweensOf=function killTweensOf(t,e,r){for(var n=this.getTweensOf(t,r),i=n.length;i--;)n[i].kill(t,e);return this},t.getTweensOf=function getTweensOf(t,e){for(var r,n=[],i=vt(t),a=this._first;a;)a instanceof Xt?!_(a._targets,i)||e&&!a.isActive()||n.push(a):(r=a.getTweensOf(i,e)).length&&n.push.apply(n,r),a=a._next;return n},t.tweenTo=function tweenTo(t,e){var r=this,n=Aa(r,t),i=e&&e.startAt,a=Xt.to(r,fa({ease:"none",lazy:!1,time:n,duration:Math.abs(n-(i&&"time"in i?i.time:r._time))/r.timeScale()||B,onStart:function onStart(){r.pause();var t=Math.abs(n-r._time)/r.timeScale();a._dur!==t&&(a._dur=t,a.render(a._time,!0,!0)),e&&e.onStart&&e.onStart.apply(a,e.onStartParams||[])}},e));return a},t.tweenFromTo=function tweenFromTo(t,e,r){return this.tweenTo(e,fa({startAt:{time:Aa(this,t)}},r))},t.recent=function recent(){return this._recent},t.nextLabel=function nextLabel(t){return void 0===t&&(t=this._time),Wa(this,Aa(this,t))},t.previousLabel=function previousLabel(t){return void 0===t&&(t=this._time),Wa(this,Aa(this,t),1)},t.currentLabel=function currentLabel(t){return arguments.length?this.seek(t,!0):this.previousLabel(this._time+B)},t.shiftChildren=function shiftChildren(t,e,r){void 0===r&&(r=0);for(var n,i=this._first,a=this.labels;i;)i._start>=r&&(i._start+=t),i=i._next;if(e)for(n in a)a[n]>=r&&(a[n]+=t);return pa(this)},t.invalidate=function invalidate(){var t=this._first;for(this._lock=0;t;)t.invalidate(),t=t._next;return i.prototype.invalidate.call(this)},t.clear=function clear(t){void 0===t&&(t=!0);for(var e,r=this._first;r;)e=r._next,this.remove(r),r=e;return this._time=this._tTime=0,t&&(this.labels={}),pa(this)},t.totalDuration=function totalDuration(t){var e,r,n=0,i=this,a=i._last,s=D,o=i._repeat,u=o*i._rDelay||0,h=o<0;if(arguments.length)return h?i:i.timeScale(i.totalDuration()/t);if(i._dirty){for(;a;)e=a._prev,a._dirty&&a.totalDuration(),a._start>s&&i._sort&&a._ts&&!i._lock?(i._lock=1,ua(i,a,a._start-a._delay),i._lock=0):s=a._start,a._start<0&&a._ts&&(n-=a._start,(!i.parent&&!i._dp||i.parent&&i.parent.smoothChildTiming)&&(i._start+=a._start/i._ts,i._time-=a._start,i._tTime-=a._start),i.shiftChildren(-a._start,!1,-D),s=0),n<(r=a._end=a._start+a._tDur/Math.abs(a._ts||a._pauseTS))&&a._ts&&(n=$(r)),a=e;i._dur=i===R&&i._time>n?i._time:Math.min(D,n),i._tDur=h&&(i._dur||u)?1e20:Math.min(D,n*(o+1)+u),i._end=i._start+(i._tDur/Math.abs(i._ts||i._pauseTS)||0),i._dirty=0}return i._tDur},Timeline.updateRoot=function updateRoot(t){if(R._ts&&ca(R,ta(t,R)),At.frame>=ft){ft+=U.autoSleep||120;var e=R._first;if((!e||!e._ts)&&U.autoSleep&&At._listeners.length<2){for(;e&&!e._ts;)e=e._next;e||At.sleep()}}},Timeline}(Rt);fa(Et.prototype,{_lock:0,_hasPause:0,_forcing:0});function Bb(t,e,i,a,s,u){var h,l,f,c;if(ht[t]&&!1!==(h=new ht[t]).init(s,h.rawVars?e[t]:function _processVars(t,e,i,a,s){if(o(t)&&(t=Yt(t,s,e,i,a)),!r(t)||t.style&&t.nodeType||G(t))return n(t)?Yt(t,s,e,i,a):t;var u,h={};for(u in t)h[u]=Yt(t[u],s,e,i,a);return h}(e[t],a,s,u,i),i,a,u)&&(i._pt=l=new te(i._pt,s,t,0,1,h.render,h,0,h.priority),i!==d))for(f=i._ptLookup[i._targets.indexOf(s)],c=h._props.length;c--;)f[h._props[c]]=l;return h}var zt,Lt=function _addPropTween(t,e,r,i,a,s,u,h,l){o(i)&&(i=i(a||0,t,s));var f,c=t[e],p="get"!==r?r:o(c)?l?t[e.indexOf("set")||!o(t["get"+e.substr(3)])?e:"get"+e.substr(3)](l):t[e]():c,d=o(c)?l?qt:Ut:Zt;if(n(i)&&(~i.indexOf("random(")&&(i=Ta(i)),"="===i.charAt(1)&&(i=parseFloat(p)+parseFloat(i.substr(2))*("-"===i.charAt(0)?-1:1)+Da(p))),p!==i)return isNaN(p+i)?(c||e in t||K(e,i),function _addComplexStringPropTween(t,e,r,n,i,a,s){var o,u,h,l,f,c,p,d,_=new te(this._pt,t,e,0,1,Wt,null,i),m=0,g=0;for(_.b=r,_.e=n,r+="",(p=~(n+="").indexOf("random("))&&(n=Ta(n)),a&&(a(d=[r,n],t,e),r=d[0],n=d[1]),u=r.match(et)||[];o=et.exec(n);)l=o[0],f=n.substring(m,o.index),h?h=(h+1)%5:"rgba("===f.substr(-5)&&(h=1),l!==u[g++]&&(c=parseFloat(u[g-1]),_._pt={_next:_._pt,p:f||1===g?f:",",s:c,c:"="===l.charAt(1)?parseFloat(l.substr(2))*("-"===l.charAt(0)?-1:1):parseFloat(l)-c,m:h&&h<4?Math.round:0},m=et.lastIndex);return _.c=m<n.length?n.substring(m,n.length):"",_.fp=s,(nt.test(n)||p)&&(_.e=0),this._pt=_}.call(this,t,e,p,i,d,h||U.stringFilter,l)):(f=new te(this._pt,t,e,+p||0,i-(p||0),"boolean"==typeof c?Qt:Vt,0,d),l&&(f.fp=l),u&&f.modifier(u,this,t),this._pt=f)},It=function _initTween(t,e){var r,n,i,a,o,u,h,l,f,c,p,d,_=t.vars,m=_.ease,g=_.startAt,v=_.immediateRender,y=_.lazy,b=_.onUpdate,w=_.onUpdateParams,T=_.callbackScope,x=_.runBackwards,k=_.yoyoEase,A=_.keyframes,M=_.autoRevert,O=t._dur,P=t._startAt,S=t._targets,C=t.parent,D=C&&"nested"===C.data?C.parent._targets:S,B="auto"===t._overwrite,F=t.timeline;if(!F||A&&m||(m="none"),t._ease=Dt(m,E.ease),t._yEase=k?Ct(Dt(!0===k?m:k,E.ease)):0,k&&t._yoyo&&!t._repeat&&(k=t._yEase,t._yEase=t._ease,t._ease=k),!F){if(P&&P.render(-1,!0).kill(),g){if(oa(t._startAt=Xt.set(S,fa({data:"isStart",overwrite:!1,parent:C,immediateRender:!0,lazy:s(y),startAt:null,delay:0,onUpdate:b,onUpdateParams:w,callbackScope:T,stagger:0},g))),v)if(0<e)M||(t._startAt=0);else if(O)return}else if(x&&O)if(P)M||(t._startAt=0);else if(e&&(v=!1),oa(t._startAt=Xt.set(S,dt(ja(_,st),{overwrite:!1,data:"isFromStart",lazy:v&&s(y),immediateRender:v,stagger:0,parent:C}))),v){if(!e)return}else _initTween(t._startAt,e),v&&(M||(t._startAt=0));for(r=ja(_,st),d=(l=S[t._pt=0]?X(S[0]).harness:0)&&_[l.prop],n=0;n<S.length;n++){if(h=(o=S[n])._gsap||W(S)[n]._gsap,t._ptLookup[n]=c={},ut[h.id]&&ba(),p=D===S?n:D.indexOf(o),l&&!1!==(f=new l).init(o,d||r,t,p,D)&&(t._pt=a=new te(t._pt,o,f.name,0,1,f.render,f,0,f.priority),f._props.forEach(function(t){c[t]=a}),f.priority&&(u=1)),!l||d)for(i in r)ht[i]&&(f=Bb(i,r,t,p,o,D))?f.priority&&(u=1):c[i]=a=Lt.call(t,o,i,"get",r[i],p,D,0,_.stringFilter);t._op&&t._op[n]&&t.kill(o,t._op[n]),B&&(zt=t,R.killTweensOf(o,c,!0),zt=0),t._pt&&(s(y)&&O||y&&!O)&&(ut[h.id]=1)}u&&Ht(t),t._onInit&&t._onInit(t)}t._from=!F&&!!_.runBackwards,t._onUpdate=b,t._initted=1},Yt=function _parseFuncOrString(t,e,r,i,a){return o(t)?t.call(e,r,i,a):n(t)&&~t.indexOf("random(")?Ta(t):t},Nt=pt+",repeat,repeatDelay,yoyo,yoyoEase",$t=(Nt+",id,stagger,delay,duration").split(","),Xt=function(k){function Tween(t,e,n){var i;"number"==typeof e&&(n.duration=e,e=n,n=null);var a,o,h,l,f,c,p,d,_=(i=k.call(this,function _inheritDefaults(t){var e=t.parent||R,r=t.keyframes?ga:fa;if(s(t.inherit))for(;e;)r(t,e.vars.defaults),e=e.parent;return t}(e),n)||this).vars,m=_.duration,g=_.delay,v=_.immediateRender,y=_.stagger,b=_.overwrite,w=_.keyframes,T=_.defaults,x=vt(t);if(i._targets=x.length?W(x):L("GSAP target "+t+" not found. https://greensock.com",!U.nullTargetWarn)||[{}],i._ptLookup=[],i._overwrite=b,w||y||u(m)||u(g)){if(e=i.vars,(a=i.timeline=new Et({data:"nested",defaults:T||{}})).kill(),a.parent=_assertThisInitialized(i),w)fa(a.vars.defaults,{ease:"none"}),w.forEach(function(t){return a.to(x,t,">")});else{if(l=x.length,p=y?Ja(y):N,r(y))for(f in y)~Nt.indexOf(f)&&((d=d||{})[f]=y[f]);for(o=0;o<l;o++){for(f in h={},e)$t.indexOf(f)<0&&(h[f]=e[f]);h.stagger=0,d&&dt(h,d),e.yoyoEase&&!e.repeat&&(h.yoyoEase=e.yoyoEase),c=x[o],h.duration=+Yt(m,_assertThisInitialized(i),o,c,x),h.delay=(+Yt(g,_assertThisInitialized(i),o,c,x)||0)-i._delay,!y&&1===l&&h.delay&&(i._delay=g=h.delay,i._start+=g,h.delay=0),a.to(c,h,p(o,c,x))}m=g=0}m||i.duration(m=a.duration())}else i.timeline=0;return!0===b&&(zt=_assertThisInitialized(i),R.killTweensOf(x),zt=0),(v||!m&&!w&&i._start===i.parent._time&&s(v)&&function _hasNoPausedAncestors(t){return!t||t._ts&&_hasNoPausedAncestors(t.parent)}(_assertThisInitialized(i))&&"nested"!==i.parent.data)&&(i._tTime=-B,i.render(Math.max(0,-g))),i}_inheritsLoose(Tween,k);var t=Tween.prototype;return t.render=function render(t,e,r){var n,i,a,s,o,u,h,l,f,c=this._time,p=this._tDur,d=this._dur,_=p-B<t&&0<=t?p:t<B?0:t;if(d){if(_!==this._tTime||r||this._startAt&&this._zTime<0!=t<0){if(n=_,l=this.timeline,this._repeat){if(s=d+this._rDelay,d<(n=$(_%s))&&(n=d),(a=~~(_/s))&&a===_/s&&(n=d,a--),(u=this._yoyo&&1&a)&&(f=this._yEase,n=d-n),(o=~~(this._tTime/s))&&o===this._tTime/s&&o--,n===c&&!r)return this;a!==o&&this.vars.repeatRefresh&&!this._lock&&(this._lock=1,this.render(s*a,!0).invalidate()._lock=0)}if(!this._initted&&va(this,n,r,e))return this;for(this._tTime=_,this._time=n,!this._act&&this._ts&&(this._act=1,this._lazy=0),this.ratio=h=(f||this._ease)(n/d),this._from&&(this.ratio=h=1-h),c||!n||e||bt(this,"onStart"),i=this._pt;i;)i.r(h,i.d),i=i._next;l&&l.render(t<0?t:!n&&u?-B:l._dur*h,e,r)||this._startAt&&(this._zTime=t),this._onUpdate&&!e&&(t<0&&this._startAt&&this._startAt.render(t,!0,r),bt(this,"onUpdate")),this._repeat&&a!==o&&this.vars.onRepeat&&!e&&this.parent&&bt(this,"onRepeat"),_!==p&&_||this._tTime!==_||(t<0&&this._startAt&&!this._onUpdate&&this._startAt.render(t,!0,r),!t&&d||!(_||this._ts<0)||oa(this,1),e||t<0&&!c||(bt(this,_===p?"onComplete":"onReverseComplete",!0),this._prom&&_===p&&this._prom()))}}else!function _renderZeroDurationTween(t,e,r,n){var i,a,s,o=t._zTime<0?0:1,u=e<0?0:1,h=t._rDelay,l=0;if(h&&t._repeat&&((a=~~((l=mt(0,t._tDur,e))/h))&&a===l/h&&a--,(s=~~(t._tTime/h))&&s===t._tTime/h&&s--,a!==s&&(o=1-u,t.vars.repeatRefresh&&t.invalidate())),(t._initted||!va(t,e,n,r))&&(u!==o||n)){for(r&&!e||(t._zTime=e),t.ratio=u,t._from&&(u=1-u),t._time=0,t._tTime=l,r||bt(t,"onStart"),i=t._pt;i;)i.r(u,i.d),i=i._next;!u&&t._startAt&&!t._onUpdate&&t._start&&t._startAt.render(e,!0,n),t._onUpdate&&!r&&bt(t,"onUpdate"),l&&t._repeat&&!r&&t.parent&&bt(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===u&&(t.ratio&&oa(t,1),r||(bt(t,t.ratio?"onComplete":"onReverseComplete",!0),t._prom&&t.ratio&&t._prom()))}}(this,t,e,r);return this},t.targets=function targets(){return this._targets},t.invalidate=function invalidate(){return this._pt=this._op=this._startAt=this._onUpdate=this._act=this._lazy=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(),k.prototype.invalidate.call(this)},t.kill=function kill(t,e){if(void 0===e&&(e="all"),zt===this)return zt;if(!(t||e&&"all"!==e)&&this.parent)return this._lazy=0,Ya(this);if(this.timeline)return this.timeline.killTweensOf(t,e),this;var r,i,a,s,o,u,h,l=this._targets,f=t?vt(t):l,c=this._ptLookup,p=this._pt;if((!e||"all"===e)&&function _arraysMatch(t,e){for(var r=t.length,n=r===e.length;n&&r--&&t[r]===e[r];);return r<0}(l,f))return Ya(this);for(r=this._op=this._op||[],"all"!==e&&(n(e)&&(o={},Z(e,function(t){return o[t]=1}),e=o),e=function _addAliasesToVars(t,e){var r,n,i,a,s=t[0]?X(t[0]).harness:0,o=s&&s.aliases;if(!o)return e;for(n in r=dt({},e),o)if(n in r)for(i=(a=o[n].split(",")).length;i--;)r[a[i]]=r[n];return r}(l,e)),h=l.length;h--;)if(~f.indexOf(l[h]))for(o in i=c[h],"all"===e?(r[h]=e,s=i,a={}):(a=r[h]=r[h]||{},s=e),s)(u=i&&i[o])&&("kill"in u.d&&!0!==u.d.kill(o)||(na(this,u,"_pt"),delete i[o])),"all"!==a&&(a[o]=1);return this._initted&&!this._pt&&p&&Ya(this),this},Tween.to=function to(t,e,r){return new Tween(t,e,r)},Tween.from=function from(t,e){return new Tween(t,aa(arguments,1))},Tween.delayedCall=function delayedCall(t,e,r,n){return new Tween(e,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:t,onComplete:e,onReverseComplete:e,onCompleteParams:r,onReverseCompleteParams:r,callbackScope:n})},Tween.fromTo=function fromTo(t,e,r){return new Tween(t,aa(arguments,2))},Tween.set=function set(t,e){return e.duration=0,e.repeatDelay||(e.repeat=0),new Tween(t,e)},Tween.killTweensOf=function killTweensOf(t,e,r){return R.killTweensOf(t,e,r)},Tween}(Rt);fa(Xt.prototype,{_targets:[],_initted:0,_lazy:0,_startAt:0,_op:0,_onInit:0}),Z("staggerTo,staggerFrom,staggerFromTo",function(r){Xt[r]=function(){var t=new Et,e=vt(arguments);return e.splice("staggerFromTo"===r?5:4,0,0),t[r].apply(t,e)}});function Mb(t,e,r){return t.setAttribute(e,r)}function Ub(t,e,r,n){n.mSet(t,e,n.m.call(n.tween,r,n.mt),n)}var Zt=function _setterPlain(t,e,r){return t[e]=r},Ut=function _setterFunc(t,e,r){return t[e](r)},qt=function _setterFuncWithParam(t,e,r,n){return t[e](n.fp,r)},jt=function _getSetter(t,e){return o(t[e])?Ut:q(t[e])&&t.setAttribute?Mb:Zt},Vt=function _renderPlain(t,e){return e.set(e.t,e.p,~~(1e4*(e.s+e.c*t))/1e4,e)},Qt=function _renderBoolean(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},Wt=function _renderComplexString(t,e){var r=e._pt,n="";if(!t&&e.b)n=e.b;else if(1===t&&e.e)n=e.e;else{for(;r;)n=r.p+(r.m?r.m(r.s+r.c*t):~~(1e4*(r.s+r.c*t))/1e4)+n,r=r._next;n+=e.c}e.set(e.t,e.p,n,e)},Gt=function _renderPropTweens(t,e){for(var r=e._pt;r;)r.r(t,r.d),r=r._next},Jt=function _addPluginModifier(t,e,r,n){for(var i,a=this._pt;a;)i=a._next,a.p===n&&a.modifier(t,e,r),a=i},Kt=function _killPropTweensOf(t){for(var e,r,n=this._pt;n;)r=n._next,n.p===t&&!n.op||n.op===t?na(this,n,"_pt"):n.dep||(e=1),n=r;return!e},Ht=function _sortPropTweensByPriority(t){for(var e,r,n,i,a=t._pt;a;){for(e=a._next,r=n;r&&r.pr>a.pr;)r=r._next;(a._prev=r?r._prev:i)?a._prev._next=a:n=a,(a._next=r)?r._prev=a:i=a,a=e}t._pt=n},te=(PropTween.prototype.modifier=function modifier(t,e,r){this.mSet=this.mSet||this.set,this.set=Ub,this.m=t,this.mt=r,this.tween=e},PropTween);function PropTween(t,e,r,n,i,a,s,o,u){this.t=e,this.s=n,this.c=i,this.p=r,this.r=a||Vt,this.d=s||this,this.set=o||Zt,this.pr=u||0,(this._next=t)&&(t._prev=this)}Z(pt+",parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert",function(t){st[t]=1,"on"===t.substr(0,2)&&(st[t+"Params"]=1)}),at.TweenMax=at.TweenLite=Xt,at.TimelineLite=at.TimelineMax=Et,R=new Et({sortChildren:!1,defaults:E,autoRemoveChildren:!0,id:"root"}),U.stringFilter=gb;var ee={registerPlugin:function registerPlugin(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];e.forEach(function(t){return function _createPlugin(t){var e=(t=!t.name&&t.default||t).name,r=o(t),n=e&&!r&&t.init?function(){this._props=[]}:t,i={init:N,render:Gt,add:Lt,kill:Kt,modifier:Jt,rawVars:0},a={targetTest:0,get:0,getSetter:jt,aliases:{},register:0};if(Mt(),t!==n){if(ht[e])return;fa(n,fa(ja(t,i),a)),dt(n.prototype,dt(i,ja(t,a))),ht[n.prop=e]=n,t.targetTest&&(ct.push(n),st[e]=1),e=("css"===e?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}M(e,n),t.register&&t.register(ee,n,te)}(t)})},timeline:function timeline(t){return new Et(t)},getTweensOf:function getTweensOf(t,e){return R.getTweensOf(t,e)},getProperty:function getProperty(i,t,e,r){n(i)&&(i=vt(i)[0]);var a=X(i||{}).get,s=e?ea:da;return"native"===e&&(e=""),i?t?s((ht[t]&&ht[t].get||a)(i,t,e,r)):function(t,e,r){return s((ht[t]&&ht[t].get||a)(i,t,e,r))}:i},quickSetter:function quickSetter(r,e,n){if(1<(r=vt(r)).length){var i=r.map(function(t){return ee.quickSetter(t,e,n)}),a=i.length;return function(t){for(var e=a;e--;)i[e](t)}}r=r[0]||{};var s=ht[e],o=X(r),u=s?function(t){var e=new s;d._pt=0,e.init(r,n?t+n:t,d,0,[r]),e.render(1,e),d._pt&&Gt(1,d)}:o.set(r,e);return s?u:function(t){return u(r,e,n?t+n:t,o,1)}},isTweening:function isTweening(t){return 0<R.getTweensOf(t,!0).length},defaults:function defaults(t){return t&&t.ease&&(t.ease=Dt(t.ease,E.ease)),ia(E,t||{})},config:function config(t){return ia(U,t||{})},registerEffect:function registerEffect(t){var i=t.name,n=t.effect,e=t.plugins,a=t.defaults,s=t.extendTimeline;(e||"").split(",").forEach(function(t){return t&&!ht[t]&&!at[t]&&L(i+" effect requires "+t+" plugin.")}),lt[i]=function(t,e){return n(vt(t),fa(e||{},a))},s&&(Et.prototype[i]=function(t,e,n){return this.add(lt[i](t,r(e)?e:(n=e)&&{}),n)})},registerEase:function registerEase(t,e){Ot[t]=Dt(e)},parseEase:function parseEase(t,e){return arguments.length?Dt(t,e):Ot},getById:function getById(t){return R.getById(t)},exportRoot:function exportRoot(t,e){void 0===t&&(t={});var r,n,i=new Et(t);for(i.smoothChildTiming=s(t.smoothChildTiming),R.remove(i),i._dp=0,i._time=i._tTime=R._time,r=R._first;r;)n=r._next,!e&&!r._dur&&r instanceof Xt&&r.vars.onComplete===r._targets[0]||ua(i,r,r._start-r._delay),r=n;return ua(R,i,0),i},utils:{wrap:function wrap(e,t,r){var n=t-e;return G(e)?Qa(e,wrap(0,e.length),t):Ba(r,function(t){return(n+(t-e)%n)%n+e})},wrapYoyo:function wrapYoyo(e,t,r){var n=t-e,i=2*n;return G(e)?Qa(e,wrapYoyo(0,e.length-1),t):Ba(r,function(t){return e+(n<(t=(i+(t-e)%i)%i)?i-t:t)})},distribute:Ja,random:Ma,snap:La,normalize:function normalize(t,e,r){return yt(t,e,0,1,r)},getUnit:Da,clamp:function clamp(e,r,t){return Ba(t,function(t){return mt(e,r,t)})},splitColor:cb,toArray:vt,mapRange:yt,pipe:function pipe(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];return function(t){return e.reduce(function(t,e){return e(t)},t)}},unitize:function unitize(e,r){return function(t){return e(parseFloat(t))+(r||Da(t))}},interpolate:function interpolate(e,r,t,i){var a=isNaN(e+r)?0:function(t){return(1-t)*e+t*r};if(!a){var s,o,u,h,l,f=n(e),c={};if(!0===t&&(i=1)&&(t=null),f)e={p:e},r={p:r};else if(G(e)&&!G(r)){for(u=[],h=e.length,l=h-2,o=1;o<h;o++)u.push(interpolate(e[o-1],e[o]));h--,a=function func(t){t*=h;var e=Math.min(l,~~t);return u[e](t-e)},t=r}else i||(e=dt(G(e)?[]:{},e));if(!u){for(s in r)Lt.call(c,e,s,"get",r[s]);a=function func(t){return Gt(t,c)||(f?e.p:e)}}}return Ba(t,a)}},install:J,effects:lt,ticker:At,updateRoot:Et.updateRoot,plugins:ht,globalTimeline:R,core:{PropTween:te,globals:M,Tween:Xt,Timeline:Et,Animation:Rt,getCache:X}};Z("to,from,fromTo,delayedCall,set,killTweensOf",function(t){return ee[t]=Xt[t]}),At.add(Et.updateRoot),d=ee.to({},{duration:0});function Zb(t,a){return{name:t,rawVars:1,init:function init(t,i,e){e._onInit=function(t){var e,r;if(n(i)&&(e={},Z(i,function(t){return e[t]=1}),i=e),a){for(r in e={},i)e[r]=a(i[r]);i=e}!function _addModifiers(t,e){var r,n,i,a=t._targets;for(r in e)for(n=a.length;n--;)(i=t._ptLookup[n][r])&&i.d.modifier&&i.d.modifier(e[r],t,a[n],r)}(t,i)}}}}ee.registerPlugin({name:"attr",init:function init(t,e,r,n,i){for(var a in e)this.add(t,"setAttribute",(t.getAttribute(a)||0)+"",e[a],n,i,0,0,a),this._props.push(a)}},{name:"endArray",init:function init(t,e){for(var r=e.length;r--;)this.add(t,r,t[r],e[r])}},Zb("roundProps",Ka),Zb("modifiers"),Zb("snap",La)),Xt.version=Et.version=ee.version="3.0.1",f=1,t()&&Mt();function Ic(t,e){return e.set(e.t,e.p,~~(1e4*(e.s+e.c*t))/1e4+e.u,e)}function Jc(t,e){return e.set(e.t,e.p,1===t?e.e:~~(1e4*(e.s+e.c*t))/1e4+e.u,e)}function Kc(t,e){return e.set(e.t,e.p,t?~~(1e4*(e.s+e.c*t))/1e4+e.u:e.b,e)}function Lc(t,e){var r=e.s+e.c*t;e.set(e.t,e.p,~~(r+(r<0?-.5:.5))+e.u,e)}function Mc(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)}function Nc(t,e){return e.set(e.t,e.p,1!==t?e.b:e.e,e)}function Oc(t,e,r){return t.style[e]=r}function Pc(t,e,r){return t.style.setProperty(e,r)}function Qc(t,e,r){return t._gsap[e]=r}function Rc(t,e,r){return t._gsap.scaleX=t._gsap.scaleY=r}function Sc(t,e,r,n,i){var a=t._gsap;a.scaleX=a.scaleY=r,a.renderTransform(i,a)}function Tc(t,e,r,n,i){var a=t._gsap;a[e]=r,a.renderTransform(i,a)}function Xc(t,e){var r=ne.createElementNS?ne.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):ne.createElement(t);return r.style?r:ne.createElement(t)}function Yc(t,e){var r=getComputedStyle(t);return r[e]||r.getPropertyValue(e.replace(Ee,"-$1").toLowerCase())||r.getPropertyValue(e)}function Zc(t,e){var r=(e||se).style,n=5,i="O,Moz,ms,Ms,Webkit".split(",");if(t in r)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);n--&&!(i[n]+t in r););return n<0?null:(3===n?"ms":0<=n?i[n]:"")+t}function $c(){!function _windowExists(){return"undefined"!=typeof window}()||(re=window,ne=re.document,ie=ne.documentElement,se=Xc("div")||{style:{}},oe=Xc("div"),Ne=Zc(Ne),$e=Zc($e),se.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",he=!!Zc("perspective"),ae=1)}function ad(t,e){for(var r=e.length;r--;)if(t.hasAttribute(e[r]))return t.getAttribute(e[r])}function bd(e){var r;try{r=e.getBBox()}catch(t){r=function _getBBoxHack(t){var e,r=Xc("svg",this.ownerSVGElement&&this.ownerSVGElement.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),n=this.parentNode,i=this.nextSibling,a=this.style.cssText;if(ie.appendChild(r),r.appendChild(this),this.style.display="block",t)try{e=this.getBBox(),this._gsapBBox=this.getBBox,this.getBBox=_getBBoxHack}catch(t){}else this._gsapBBox&&(e=this._gsapBBox());return i?n.insertBefore(this,i):n.appendChild(this),ie.removeChild(r),this.style.cssText=a,e}.call(e,!0)}return!r||r.width||r.x||r.y?r:{x:+ad(e,["x","cx","x1"]),y:+ad(e,["y","cy","y1"]),width:0,height:0}}function cd(t){return!(!t.getCTM||t.parentNode&&!t.ownerSVGElement||!bd(t))}function dd(t,e){if(e){var r=t.style;e in De&&(e=Ne),r.removeProperty?("ms"!==e.substr(0,2)&&"webkit"!==e.substr(0,6)||(e="-"+e),r.removeProperty(e.replace(Ee,"-$1").toLowerCase())):r.removeAttribute(e)}}function ed(t,e,r,n,i,a){var s=new te(t._pt,e,r,0,1,a?Nc:Mc);return(t._pt=s).b=n,s.e=i,t._props.push(r),s}function gd(t,e,r,n){var i,a,s,o,u=parseFloat(r),h=(r+"").substr((u+"").length)||"px",l=se.style,f=Le.test(e),c="svg"===t.tagName.toLowerCase(),p=(c?"client":"offset")+(f?"Width":"Height"),d="px"===n;return n===h||Xe[n]||Xe[h]?u:(o=t.getCTM&&cd(t),"%"===n&&De[e]?$(u/(o?t.getBBox()[f?"width":"height"]:t[p])*100):(l[f?"width":"height"]=100+(d?h:n),a="em"===n&&t.appendChild&&!c?t:t.parentNode,o&&(a=(t.ownerSVGElement||{}).parentNode),a&&a!==ne&&a.appendChild||(a=ne.body),(s=a._gsap)&&"%"===n&&s.width&&f&&s.time===At.time?i=s.width*u/100:(a.appendChild(se),i=se[p],a.removeChild(se),f&&"%"===n&&((s=X(a)).time=At.time,s.width=i/u*100)),$(d?i*u/100:100/i*u)))}function hd(t,e,r,n){var i;return ae||$c(),e in Ye&&~(e=Ye[e]).indexOf(",")&&(e=e.split(",")[0]),De[e]?(i=Ve(t,n),i="transformOrigin"!==e?i[e]:Qe(Yc(t,$e))+i.zOrigin+"px"):(i=t.style[e])&&"auto"!==i&&!n||(i=Yc(t,e)||Y(t,e)),r?gd(t,e,i,r)+r:i}function id(t,e,r,n){var i,a,s,o,u,h,l,f,c,p,d,_,m=new te(this._pt,t.style,e,0,1,Wt),g=0,v=0;if(m.b=r,m.e=n,r+="","auto"===(n+="")&&(t.style[e]=n,n=Yc(t,e)||n,t.style[e]=r),gb(i=[r,n]),n=i[1],s=(r=i[0]).match(ze)||[],(n.match(ze)||[]).length){for(;a=ze.exec(n);)l=a[0],c=n.substring(g,a.index),u?u=(u+1)%5:"rgba("===c.substr(-5)&&(u=1),l!==(h=s[v++]||"")&&(o=parseFloat(h)||0,d=h.substr((o+"").length),(_="="===l.charAt(1)?+(l.charAt(0)+"1"):0)&&(l=l.substr(2)),f=parseFloat(l),p=l.substr((f+"").length),g=ze.lastIndex-p.length,p||(p=p||U.units[e]||d,g===n.length&&(n+=p,m.e+=p)),d!==p&&(o=gd(t,e,h,p)),m._pt={_next:m._pt,p:c||1===v?c:",",s:o,c:_?_*f:f-o,m:u&&u<4?Math.round:0});m.c=g<n.length?n.substring(g,n.length):""}else m.r="display"===e?Nc:Mc;return nt.test(n)&&(m.e=0),this._pt=m}function kd(t){var e=t.split(" "),r=e[0],n=e[1]||"50%";return"top"!==r&&"bottom"!==r&&"left"!==n&&"right"!==n||(e=r,r=n,n=e),e[0]=Ze[r]||r,e[1]=Ze[n]||n,e.join(" ")}function ld(t,e){if(e.tween&&e.tween._time===e.tween._dur){var r,n,i,a=e.t,s=a.style,o=e.u;if("all"===o||!0===o)s.cssText="",n=1;else for(i=(o=o.split(",")).length;-1<--i;)r=o[i],De[r]&&(n=1,r="transformOrigin"===r?$e:Ne),dd(a,r);n&&(dd(a,Ne),(n=a._gsap)&&(n.svg&&a.removeAttribute("transform"),delete n.x))}}function pd(t){return"matrix(1, 0, 0, 1, 0, 0)"===t||"none"===t||!t}function qd(t){var e=Yc(t,Ne);return pd(e)?qe:e.substr(7).match(tt).map($)}function rd(t,e){var r,n,i,a,s=t._gsap,o=t.style,u=qd(t);return s.svg&&t.getAttribute("transform")?"1,0,0,1,0,0"===(u=[(i=t.transform.baseVal.consolidate().matrix).a,i.b,i.c,i.d,i.e,i.f]).join(",")?qe:u:(u!==qe||t.offsetParent||t===ie||s.svg||(i=o.display,o.display="block",(r=t.parentNode)&&t.offsetParent||(a=1,n=t.nextSibling,ie.appendChild(t)),u=qd(t),i?o.display=i:dd(t,"display"),a&&(n?r.insertBefore(t,n):r?r.appendChild(t):ie.removeChild(t))),e&&6<u.length?[u[0],u[1],u[4],u[5],u[12],u[13]]:u)}function sd(t,e,r,n,i,a){var s,o,u,h=t._gsap,l=i||rd(t,!0),f=h.xOrigin||0,c=h.yOrigin||0,p=h.xOffset||0,d=h.yOffset||0,_=l[0],m=l[1],g=l[2],v=l[3],y=l[4],b=l[5],w=e.split(" "),T=parseFloat(w[0])||0,x=parseFloat(w[1])||0;r?l!==qe&&(o=_*v-m*g)&&(u=T*(-m/o)+x*(_/o)-(_*b-m*y)/o,T=T*(v/o)+x*(-g/o)+(g*b-v*y)/o,x=u):(T=(s=bd(t)).x+(~w[0].indexOf("%")?T/100*s.width:T),x=s.y+(~(w[1]||w[0]).indexOf("%")?x/100*s.height:x)),n||!1!==n&&h.smooth?(y=T-f,b=x-c,h.xOffset+=y*_+b*g-y,h.yOffset+=y*m+b*v-b):h.xOffset=h.yOffset=0,h.xOrigin=T,h.yOrigin=x,h.smooth=!!n,h.origin=e,h.originIsAbsolute=!!r,a&&(ed(a,h,"xOrigin",f,T),ed(a,h,"yOrigin",c,x),ed(a,h,"xOffset",p,h.xOffset),ed(a,h,"yOffset",d,h.yOffset))}function vd(t,e,r){var n=Da(e);return $(parseFloat(e)+parseFloat(gd(t,"x",r+"px",n)))+n}function Cd(t,e,r,i,a,s){var o,u,h=360,l=n(a),f=parseFloat(a)*(l&&~a.indexOf("rad")?Be:1),c=s?f*s:f-i,p=i+c+"deg";return l&&("short"===(o=a.split("_")[1])&&(c%=h)!==c%180&&(c+=c<0?h:-h),"cw"===o&&c<0?c=(c+36e9)%h-~~(c/h)*h:"ccw"===o&&0<c&&(c=(c-36e9)%h-~~(c/h)*h)),t._pt=u=new te(t._pt,e,r,i,c,Jc),u.e=p,u.u="deg",t._props.push(r),u}function Dd(t,e,r){var n,i,a,s,o,u,h,l=oe.style,f=r._gsap;for(i in l.cssText=getComputedStyle(r).cssText+";position:absolute;display:block;",l[Ne]=e,ne.body.appendChild(oe),n=Ve(oe,1),De)(a=f[i])!==(s=n[i])&&"perspective"!==i&&(o=Da(a)!==(h=Da(s))?gd(r,i,a,h):parseFloat(a),u=parseFloat(s),t._pt=new te(t._pt,f,i,o,u-o,Ic),t._pt.u=h,t._props.push(i));ne.body.removeChild(oe)}var re,ne,ie,ae,se,oe,ue,he,le,fe,ce,pe=Ot.Power0,de=Ot.Power1,_e=Ot.Power2,me=Ot.Power3,ge=Ot.Power4,ve=Ot.Linear,ye=Ot.Quad,be=Ot.Cubic,we=Ot.Quart,Te=Ot.Quint,xe=Ot.Strong,ke=Ot.Elastic,Ae=Ot.Back,Me=Ot.SteppedEase,Oe=Ot.Bounce,Pe=Ot.Sine,Se=Ot.Expo,Ce=Ot.Circ,De={},Be=180/Math.PI,Fe=Math.PI/180,Re=Math.atan2,Ee=/([A-Z])/g,ze=/[-+=\.]*\d+[\.e-]*\d*[a-z%]*/g,Le=/(?:left|right|width|margin|padding|x)/i,Ie=/[\s,\(]\S/,Ye={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Ne="transform",$e=Ne+"Origin",Xe={deg:1,rad:1,turn:1},Ze={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Ue={clearProps:function clearProps(t,e,r,n,i){var a=t._pt=new te(t._pt,e,r,0,0,ld);return a.u=n,a.pr=-10,a.tween=i,t._props.push(r),1}},qe=[1,0,0,1,0,0],je={},Ve=function _parseTransform(t,e){var r=t._gsap||new Ft(t);if("x"in r&&!e)return r;var n,i,a,s,o,u,h,l,f,c,p,d,_,m,g,v,y,b,w,T,x,k,A,M,O,P,S,C,D,B,F=t.style,R=r.scaleX<0,E=r.xOrigin||0,z=r.yOrigin||0,L="deg",I=Yc(t,$e)||"0";return n=i=a=u=h=l=f=c=p=0,s=o=1,r.svg=!(!t.getCTM||!cd(t)),d=rd(t,r.svg),r.svg&&sd(t,I,r.originIsAbsolute,!1!==r.smooth,d),d!==qe&&(v=d[0],y=d[1],b=d[2],w=d[3],n=T=d[4],i=x=d[5],6===d.length?(s=Math.sqrt(v*v+y*y),o=Math.sqrt(w*w+b*b),u=v||y?Re(y,v)*Be:r.rotation||0,f=b||w?Re(b,w)*Be+u:r.skewX||0,r.svg&&(n-=E-(E*v+z*b),i-=z-(E*y+z*w))):(B=d[6],C=d[7],O=d[8],P=d[9],S=d[10],D=d[11],n=d[12],i=d[13],a=d[14],h=(_=Re(B,S))*Be,_&&(k=T*(m=Math.cos(-_))+O*(g=Math.sin(-_)),A=x*m+P*g,M=B*m+S*g,O=T*-g+O*m,P=x*-g+P*m,S=B*-g+S*m,D=C*-g+D*m,T=k,x=A,B=M),l=(_=Re(-b,S))*Be,_&&(m=Math.cos(-_),D=w*(g=Math.sin(-_))+D*m,v=k=v*m-O*g,y=A=y*m-P*g,b=M=b*m-S*g),u=(_=Re(y,v))*Be,_&&(k=v*(m=Math.cos(_))+y*(g=Math.sin(_)),A=T*m+x*g,y=y*m-v*g,x=x*m-T*g,v=k,T=A),h&&359.9<Math.abs(h)+Math.abs(u)&&(h=u=0,l=180-l),s=$(Math.sqrt(v*v+y*y+b*b)),o=$(Math.sqrt(x*x+B*B)),_=Re(T,x),f=2e-4<Math.abs(_)?_*Be:0,p=D?1/(D<0?-D:D):0),r.svg&&(d=t.getAttribute("transform"),r.forceCSS=t.setAttribute("transform","")||!pd(Yc(t,Ne)),d&&t.setAttribute("transform",d))),90<Math.abs(f)&&Math.abs(f)<270&&(R?(s*=-1,f+=u<=0?180:-180,u+=u<=0?180:-180):(o*=-1,f+=f<=0?180:-180)),r.x=((r.xPercent=n&&Math.round(t.offsetWidth/2)===Math.round(-n)?-50:0)?0:n)+"px",r.y=((r.yPercent=i&&Math.round(t.offsetHeight/2)===Math.round(-i)?-50:0)?0:i)+"px",r.z=a+"px",r.scaleX=$(s),r.scaleY=$(o),r.rotation=$(u)+L,r.rotationX=$(h)+L,r.rotationY=$(l)+L,r.skewX=f+L,r.skewY=c+L,r.transformPerspective=p+"px",(r.zOrigin=parseFloat(I.split(" ")[2])||0)&&(F[$e]=Qe(I)),r.xOffset=r.yOffset=0,r.force3D=U.force3D,r.renderTransform=r.svg?tr:he?He:We,r},Qe=function _firstTwoOnly(t){return(t=t.split(" "))[0]+" "+t[1]},We=function _renderNon3DTransforms(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,He(t,e)},Ge="0deg",Je="0px",Ke=") ",He=function _renderCSSTransforms(t,e){var r=e||this,n=r.xPercent,i=r.yPercent,a=r.x,s=r.y,o=r.z,u=r.rotation,h=r.rotationY,l=r.rotationX,f=r.skewX,c=r.skewY,p=r.scaleX,d=r.scaleY,_=r.transformPerspective,m=r.force3D,g=r.target,v=r.zOrigin,y="",b="auto"===m&&t&&1!==t||!0===m;if(v&&(l!==Ge||h!==Ge)){var w,T=parseFloat(h)*Fe,x=Math.sin(T),k=Math.cos(T);T=parseFloat(l)*Fe,w=Math.cos(T),a=vd(g,a,x*w*-v),s=vd(g,s,-Math.sin(T)*-v),o=vd(g,o,k*w*-v+v)}(n||i)&&(y="translate("+n+"%, "+i+"%) "),!b&&a===Je&&s===Je&&o===Je||(y+=o!==Je||b?"translate3d("+a+", "+s+", "+o+") ":"translate("+a+", "+s+Ke),_!==Je&&(y+="perspective("+_+Ke),u!==Ge&&(y+="rotate("+u+Ke),h!==Ge&&(y+="rotateY("+h+Ke),l!==Ge&&(y+="rotateX("+l+Ke),f===Ge&&c===Ge||(y+="skew("+f+", "+c+Ke),1===p&&1===d||(y+="scale("+p+", "+d+Ke),g.style[Ne]=y||"translate(0, 0)"},tr=function _renderSVGTransforms(t,e){var r,n,i,a,s,o=e||this,u=o.xPercent,h=o.yPercent,l=o.x,f=o.y,c=o.rotation,p=o.skewX,d=o.skewY,_=o.scaleX,m=o.scaleY,g=o.target,v=o.xOrigin,y=o.yOrigin,b=o.xOffset,w=o.yOffset,T=o.forceCSS,x=parseFloat(l),k=parseFloat(f);c=parseFloat(c),p=parseFloat(p),(d=parseFloat(d))&&(p+=d=parseFloat(d),c+=d),c||p?(c*=Fe,p*=Fe,r=Math.cos(c)*_,n=Math.sin(c)*_,i=Math.sin(c-p)*-m,a=Math.cos(c-p)*m,p&&(d*=Fe,s=Math.tan(p-d),i*=s=Math.sqrt(1+s*s),a*=s,d&&(s=Math.tan(d),r*=s=Math.sqrt(1+s*s),n*=s)),r=$(r),n=$(n),i=$(i),a=$(a)):(r=_,a=m,n=i=0),(x&&!~(l+"").indexOf("px")||k&&!~(f+"").indexOf("px"))&&(x=gd(g,"x",l,"px"),k=gd(g,"y",f,"px")),(v||y||b||w)&&(x=$(x+v-(v*r+y*i)+b),k=$(k+y-(v*n+y*a)+w)),(u||h)&&(s=g.getBBox(),x=$(x+u/100*s.width),k=$(k+h/100*s.height)),s="matrix("+r+","+n+","+i+","+a+","+x+","+k+")",g.setAttribute("transform",s),T&&(g.style[Ne]=s)},er={name:"css",register:$c,targetTest:function targetTest(t){return t.style&&t.nodeType},init:function init(t,e,r,n,i){var a,s,o,u,h,l,f,c,p,d,_,m,g,v,y,b=this._props,w=t.style;for(f in ae||$c(),e)if("autoRound"!==f&&(s=e[f],!ht[f]||!Bb(f,e,r,n,t,i)))if(l=Ue[f],"function"===(h=typeof s)&&(h=typeof(s=s.call(r,n,t,i))),"string"===h&&~s.indexOf("random(")&&(s=Ta(s)),l)l(this,t,f,s,r)&&(y=1);else if("--"===f.substr(0,2))this.add(w,"setProperty",getComputedStyle(t).getPropertyValue(f)+"",s+"",n,i,0,0,f);else{if(a=hd(t,f),u=parseFloat(a),(d="string"===h&&"="===s.charAt(1)?+(s.charAt(0)+"1"):0)&&(s=s.substr(2)),o=parseFloat(s),f in Ye&&("autoAlpha"===f&&(1===u&&"hidden"===hd(t,"visibility")&&o&&(u=0),ed(this,w,"visibility",u?"inherit":"hidden",o?"inherit":"hidden",!o)),"scale"!==f&&~(f=Ye[f]).indexOf(",")&&(f=f.split(",")[0])),_=f in De){if(m||(g=t._gsap,v=!1!==e.smoothOrigin&&g.smooth,(m=this._pt=new te(this._pt,w,Ne,0,1,g.renderTransform,g)).dep=1),"scale"===f){this._pt=new te(this._pt,t,"scale",u,d?d*o:o-u,0,0,Rc),b.push("scale");continue}if("transformOrigin"===f){s=kd(s),g.svg?sd(t,s,0,v,0,this):((p=parseFloat(s.split(" ")[2]))!==g.zOrigin&&ed(this,g,"zOrigin",g.zOrigin,p),ed(this,w,f,Qe(a),Qe(s)));continue}if("svgOrigin"===f){sd(t,s,1,v,0,this);continue}if(f in je){Cd(this,g,f,u,s,d);continue}if("smoothOrigin"===f){ed(this,g,"smooth",g.smooth,s);continue}if("force3D"===f){g[f]=s;continue}if("transform"===f){Dd(this,s,t);continue}}if(_||(o||0===o)&&(u||0===u)&&!Ie.test(s)&&f in w)(c=(a+"").substr((u+"").length))!==(p=(s+"").substr((o+"").length)||(f in U.units?U.units[f]:c))&&(u=gd(t,f,a,p)),this._pt=new te(this._pt,_?g:w,f,u,d?d*o:o-u,"px"!==p||!1===e.autoRound||_?Ic:Lc),this._pt.u=p||0,c!==p&&(this._pt.b=a,this._pt.r=Kc);else if(f in w)id.call(this,t,f,a,s);else{if(!(f in t)){K("Invalid "+f+" tween "+s+". Missing plugin? gsap.registerPlugin()");continue}this.add(t,f,t[f],s,n,i)}b.push(f)}y&&Ht(this)},get:hd,aliases:Ye,getSetter:function getSetter(t,e,r){return e in De&&e!==$e&&(t._gsap.x||hd(t,"x"))?r&&ue===r?"scale"===e?Rc:Qc:(ue=r||{})&&("scale"===e?Sc:Tc):t.style&&!q(t.style[e])?Oc:~e.indexOf("-")?Pc:jt(t,e)}};ee.utils.checkPrefix=Zc,ce=Z((le="x,y,z,scale,scaleX,scaleY,xPercent,yPercent")+","+(fe="rotation,rotationX,rotationY,skewX,skewY")+",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective",function(t){De[t]=1}),Z(fe,function(t){U.units[t]="deg",je[t]=1}),Ye[ce[13]]=le+","+fe,Z("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,9:rotateX,10:rotateY",function(t){var e=t.split(":");Ye[e[1]]=ce[e[0]]}),Z("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(t){U.units[t]="px"}),ee.registerPlugin(er);var rr=ee.registerPlugin(er)||ee;e.Back=Ae,e.Bounce=Oe,e.CSSPlugin=er,e.Circ=Ce,e.Cubic=be,e.Elastic=ke,e.Expo=Se,e.Linear=ve,e.Power0=pe,e.Power1=de,e.Power2=_e,e.Power3=me,e.Power4=ge,e.Quad=ye,e.Quart=we,e.Quint=Te,e.Sine=Pe,e.SteppedEase=Me,e.Strong=xe,e.TimelineLite=Et,e.TimelineMax=Et,e.TweenLite=Xt,e.TweenMax=Xt,e.default=rr,e.gsap=rr,Object.defineProperty(e,"__esModule",{value:!0})}); //# sourceMappingURL=gsap.min.js.map
/*! ScrollMagic v2.0.7 | (c) 2019 Jan Paepke (@janpaepke) | license & info: http://scrollmagic.io */ !function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.ScrollMagic=t()}(this,function(){"use strict";var _=function(){};_.version="2.0.7",window.addEventListener("mousewheel",function(){});var P="data-scrollmagic-pin-spacer";_.Controller=function(e){var n,r,i="REVERSE",t="PAUSED",o=z.defaults,s=this,a=R.extend({},o,e),l=[],c=!1,f=0,u=t,d=!0,h=0,p=!0,g=function(){0<a.refreshInterval&&(r=window.setTimeout(E,a.refreshInterval))},v=function(){return a.vertical?R.get.scrollTop(a.container):R.get.scrollLeft(a.container)},m=function(){return a.vertical?R.get.height(a.container):R.get.width(a.container)},w=this._setScrollPos=function(e){a.vertical?d?window.scrollTo(R.get.scrollLeft(),e):a.container.scrollTop=e:d?window.scrollTo(e,R.get.scrollTop()):a.container.scrollLeft=e},y=function(){if(p&&c){var e=R.type.Array(c)?c:l.slice(0);c=!1;var t=f,n=(f=s.scrollPos())-t;0!==n&&(u=0<n?"FORWARD":i),u===i&&e.reverse(),e.forEach(function(e,t){e.update(!0)})}},S=function(){n=R.rAF(y)},b=function(e){"resize"==e.type&&(h=m(),u=t),!0!==c&&(c=!0,S())},E=function(){if(!d&&h!=m()){var t;try{t=new Event("resize",{bubbles:!1,cancelable:!1})}catch(e){(t=document.createEvent("Event")).initEvent("resize",!1,!1)}a.container.dispatchEvent(t)}l.forEach(function(e,t){e.refresh()}),g()};this._options=a;var x=function(e){if(e.length<=1)return e;var t=e.slice(0);return t.sort(function(e,t){return e.scrollOffset()>t.scrollOffset()?1:-1}),t};return this.addScene=function(e){if(R.type.Array(e))e.forEach(function(e,t){s.addScene(e)});else if(e instanceof _.Scene)if(e.controller()!==s)e.addTo(s);else if(l.indexOf(e)<0)for(var t in l.push(e),l=x(l),e.on("shift.controller_sort",function(){l=x(l)}),a.globalSceneOptions)e[t]&&e[t].call(e,a.globalSceneOptions[t]);return s},this.removeScene=function(e){if(R.type.Array(e))e.forEach(function(e,t){s.removeScene(e)});else{var t=l.indexOf(e);-1<t&&(e.off("shift.controller_sort"),l.splice(t,1),e.remove())}return s},this.updateScene=function(e,n){return R.type.Array(e)?e.forEach(function(e,t){s.updateScene(e,n)}):n?e.update(!0):!0!==c&&e instanceof _.Scene&&(-1==(c=c||[]).indexOf(e)&&c.push(e),c=x(c),S()),s},this.update=function(e){return b({type:"resize"}),e&&y(),s},this.scrollTo=function(e,t){if(R.type.Number(e))w.call(a.container,e,t);else if(e instanceof _.Scene)e.controller()===s&&s.scrollTo(e.scrollOffset(),t);else if(R.type.Function(e))w=e;else{var n=R.get.elements(e)[0];if(n){for(;n.parentNode.hasAttribute(P);)n=n.parentNode;var r=a.vertical?"top":"left",i=R.get.offset(a.container),o=R.get.offset(n);d||(i[r]-=s.scrollPos()),s.scrollTo(o[r]-i[r],t)}}return s},this.scrollPos=function(e){return arguments.length?(R.type.Function(e)&&(v=e),s):v.call(s)},this.info=function(e){var t={size:h,vertical:a.vertical,scrollPos:f,scrollDirection:u,container:a.container,isDocument:d};return arguments.length?void 0!==t[e]?t[e]:void 0:t},this.loglevel=function(e){return s},this.enabled=function(e){return arguments.length?(p!=e&&(p=!!e,s.updateScene(l,!0)),s):p},this.destroy=function(e){window.clearTimeout(r);for(var t=l.length;t--;)l[t].destroy(e);return a.container.removeEventListener("resize",b),a.container.removeEventListener("scroll",b),R.cAF(n),null},function(){for(var e in a)o.hasOwnProperty(e)||delete a[e];if(a.container=R.get.elements(a.container)[0],!a.container)throw"ScrollMagic.Controller init failed.";(d=a.container===window||a.container===document.body||!document.body.contains(a.container))&&(a.container=window),h=m(),a.container.addEventListener("resize",b),a.container.addEventListener("scroll",b);var t=parseInt(a.refreshInterval,10);a.refreshInterval=R.type.Number(t)?t:o.refreshInterval,g()}(),s};var z={defaults:{container:window,vertical:!0,globalSceneOptions:{},loglevel:2,refreshInterval:100}};_.Controller.addOption=function(e,t){z.defaults[e]=t},_.Controller.extend=function(e){var t=this;_.Controller=function(){return t.apply(this,arguments),this.$super=R.extend({},this),e.apply(this,arguments)||this},R.extend(_.Controller,t),_.Controller.prototype=t.prototype,_.Controller.prototype.constructor=_.Controller},_.Scene=function(e){var n,l,c="BEFORE",f="DURING",u="AFTER",r=D.defaults,d=this,h=R.extend({},r,e),p=c,g=0,a={start:0,end:0},v=0,i=!0,s={};this.on=function(e,i){return R.type.Function(i)&&(e=e.trim().split(" ")).forEach(function(e){var t=e.split("."),n=t[0],r=t[1];"*"!=n&&(s[n]||(s[n]=[]),s[n].push({namespace:r||"",callback:i}))}),d},this.off=function(e,o){return e&&(e=e.trim().split(" ")).forEach(function(e,t){var n=e.split("."),r=n[0],i=n[1]||"";("*"===r?Object.keys(s):[r]).forEach(function(e){for(var t=s[e]||[],n=t.length;n--;){var r=t[n];!r||i!==r.namespace&&"*"!==i||o&&o!=r.callback||t.splice(n,1)}t.length||delete s[e]})}),d},this.trigger=function(e,n){if(e){var t=e.trim().split("."),r=t[0],i=t[1],o=s[r];o&&o.forEach(function(e,t){i&&i!==e.namespace||e.callback.call(d,new _.Event(r,e.namespace,d,n))})}return d},d.on("change.internal",function(e){"loglevel"!==e.what&&"tweenChanges"!==e.what&&("triggerElement"===e.what?y():"reverse"===e.what&&d.update())}).on("shift.internal",function(e){t(),d.update()}),this.addTo=function(e){return e instanceof _.Controller&&l!=e&&(l&&l.removeScene(d),l=e,E(),o(!0),y(!0),t(),l.info("container").addEventListener("resize",S),e.addScene(d),d.trigger("add",{controller:l}),d.update()),d},this.enabled=function(e){return arguments.length?(i!=e&&(i=!!e,d.update(!0)),d):i},this.remove=function(){if(l){l.info("container").removeEventListener("resize",S);var e=l;l=void 0,e.removeScene(d),d.trigger("remove")}return d},this.destroy=function(e){return d.trigger("destroy",{reset:e}),d.remove(),d.off("*.*"),null},this.update=function(e){if(l)if(e)if(l.enabled()&&i){var t,n=l.info("scrollPos");t=0<h.duration?(n-a.start)/(a.end-a.start):n>=a.start?1:0,d.trigger("update",{startPos:a.start,endPos:a.end,scrollPos:n}),d.progress(t)}else m&&p===f&&C(!0);else l.updateScene(d,!1);return d},this.refresh=function(){return o(),y(),d},this.progress=function(e){if(arguments.length){var t=!1,n=p,r=l?l.info("scrollDirection"):"PAUSED",i=h.reverse||g<=e;if(0===h.duration?(t=g!=e,p=0===(g=e<1&&i?0:1)?c:f):e<0&&p!==c&&i?(p=c,t=!(g=0)):0<=e&&e<1&&i?(g=e,p=f,t=!0):1<=e&&p!==u?(g=1,p=u,t=!0):p!==f||i||C(),t){var o={progress:g,state:p,scrollDirection:r},s=p!=n,a=function(e){d.trigger(e,o)};s&&n!==f&&(a("enter"),a(n===c?"start":"end")),a("progress"),s&&p!==f&&(a(p===c?"start":"end"),a("leave"))}return d}return g};var m,w,t=function(){a={start:v+h.offset},l&&h.triggerElement&&(a.start-=l.info("size")*h.triggerHook),a.end=a.start+h.duration},o=function(e){if(n){var t="duration";x(t,n.call(d))&&!e&&(d.trigger("change",{what:t,newval:h[t]}),d.trigger("shift",{reason:t}))}},y=function(e){var t=0,n=h.triggerElement;if(l&&(n||0<v)){if(n)if(n.parentNode){for(var r=l.info(),i=R.get.offset(r.container),o=r.vertical?"top":"left";n.parentNode.hasAttribute(P);)n=n.parentNode;var s=R.get.offset(n);r.isDocument||(i[o]-=l.scrollPos()),t=s[o]-i[o]}else d.triggerElement(void 0);var a=t!=v;v=t,a&&!e&&d.trigger("shift",{reason:"triggerElementPosition"})}},S=function(e){0<h.triggerHook&&d.trigger("shift",{reason:"containerResize"})},b=R.extend(D.validate,{duration:function(t){if(R.type.String(t)&&t.match(/^(\.|\d)*\d+%$/)){var e=parseFloat(t)/100;t=function(){return l?l.info("size")*e:0}}if(R.type.Function(t)){n=t;try{t=parseFloat(n.call(d))}catch(e){t=-1}}if(t=parseFloat(t),!R.type.Number(t)||t<0)throw n&&(n=void 0),0;return t}}),E=function(e){(e=arguments.length?[e]:Object.keys(b)).forEach(function(t,e){var n;if(b[t])try{n=b[t](h[t])}catch(e){n=r[t]}finally{h[t]=n}})},x=function(e,t){var n=!1,r=h[e];return h[e]!=t&&(h[e]=t,E(e),n=r!=h[e]),n},z=function(t){d[t]||(d[t]=function(e){return arguments.length?("duration"===t&&(n=void 0),x(t,e)&&(d.trigger("change",{what:t,newval:h[t]}),-1<D.shifts.indexOf(t)&&d.trigger("shift",{reason:t})),d):h[t]})};this.controller=function(){return l},this.state=function(){return p},this.scrollOffset=function(){return a.start},this.triggerPosition=function(){var e=h.offset;return l&&(h.triggerElement?e+=v:e+=l.info("size")*d.triggerHook()),e},d.on("shift.internal",function(e){var t="duration"===e.reason;(p===u&&t||p===f&&0===h.duration)&&C(),t&&F()}).on("progress.internal",function(e){C()}).on("add.internal",function(e){F()}).on("destroy.internal",function(e){d.removePin(e.reset)});var C=function(e){if(m&&l){var t=l.info(),n=w.spacer.firstChild;if(e||p!==f){var r={position:w.inFlow?"relative":"absolute",top:0,left:0},i=R.css(n,"position")!=r.position;w.pushFollowers?0<h.duration&&(p===u&&0===parseFloat(R.css(w.spacer,"padding-top"))?i=!0:p===c&&0===parseFloat(R.css(w.spacer,"padding-bottom"))&&(i=!0)):r[t.vertical?"top":"left"]=h.duration*g,R.css(n,r),i&&F()}else{"fixed"!=R.css(n,"position")&&(R.css(n,{position:"fixed"}),F());var o=R.get.offset(w.spacer,!0),s=h.reverse||0===h.duration?t.scrollPos-a.start:Math.round(g*h.duration*10)/10;o[t.vertical?"top":"left"]+=s,R.css(w.spacer.firstChild,{top:o.top,left:o.left})}}},F=function(){if(m&&l&&w.inFlow){var e=p===f,t=l.info("vertical"),n=w.spacer.firstChild,r=R.isMarginCollapseType(R.css(w.spacer,"display")),i={};w.relSize.width||w.relSize.autoFullWidth?e?R.css(m,{width:R.get.width(w.spacer)}):R.css(m,{width:"100%"}):(i["min-width"]=R.get.width(t?m:n,!0,!0),i.width=e?i["min-width"]:"auto"),w.relSize.height?e?R.css(m,{height:R.get.height(w.spacer)-(w.pushFollowers?h.duration:0)}):R.css(m,{height:"100%"}):(i["min-height"]=R.get.height(t?n:m,!0,!r),i.height=e?i["min-height"]:"auto"),w.pushFollowers&&(i["padding"+(t?"Top":"Left")]=h.duration*g,i["padding"+(t?"Bottom":"Right")]=h.duration*(1-g)),R.css(w.spacer,i)}},L=function(){l&&m&&p===f&&!l.info("isDocument")&&C()},T=function(){l&&m&&p===f&&((w.relSize.width||w.relSize.autoFullWidth)&&R.get.width(window)!=R.get.width(w.spacer.parentNode)||w.relSize.height&&R.get.height(window)!=R.get.height(w.spacer.parentNode))&&F()},A=function(e){l&&m&&p===f&&!l.info("isDocument")&&(e.preventDefault(),l._setScrollPos(l.info("scrollPos")-((e.wheelDelta||e[l.info("vertical")?"wheelDeltaY":"wheelDeltaX"])/3||30*-e.detail)))};this.setPin=function(e,t){if(t=R.extend({},{pushFollowers:!0,spacerClass:"scrollmagic-pin-spacer"},t),!(e=R.get.elements(e)[0]))return d;if("fixed"===R.css(e,"position"))return d;if(m){if(m===e)return d;d.removePin()}var n=(m=e).parentNode.style.display,r=["top","left","bottom","right","margin","marginLeft","marginRight","marginTop","marginBottom"];m.parentNode.style.display="none";var i="absolute"!=R.css(m,"position"),o=R.css(m,r.concat(["display"])),s=R.css(m,["width","height"]);m.parentNode.style.display=n,!i&&t.pushFollowers&&(t.pushFollowers=!1);var a=m.parentNode.insertBefore(document.createElement("div"),m),l=R.extend(o,{position:i?"relative":"absolute",boxSizing:"content-box",mozBoxSizing:"content-box",webkitBoxSizing:"content-box"});if(i||R.extend(l,R.css(m,["width","height"])),R.css(a,l),a.setAttribute(P,""),R.addClass(a,t.spacerClass),w={spacer:a,relSize:{width:"%"===s.width.slice(-1),height:"%"===s.height.slice(-1),autoFullWidth:"auto"===s.width&&i&&R.isMarginCollapseType(o.display)},pushFollowers:t.pushFollowers,inFlow:i},!m.___origStyle){m.___origStyle={};var c=m.style;r.concat(["width","height","position","boxSizing","mozBoxSizing","webkitBoxSizing"]).forEach(function(e){m.___origStyle[e]=c[e]||""})}return w.relSize.width&&R.css(a,{width:s.width}),w.relSize.height&&R.css(a,{height:s.height}),a.appendChild(m),R.css(m,{position:i?"relative":"absolute",margin:"auto",top:"auto",left:"auto",bottom:"auto",right:"auto"}),(w.relSize.width||w.relSize.autoFullWidth)&&R.css(m,{boxSizing:"border-box",mozBoxSizing:"border-box",webkitBoxSizing:"border-box"}),window.addEventListener("scroll",L),window.addEventListener("resize",L),window.addEventListener("resize",T),m.addEventListener("mousewheel",A),m.addEventListener("DOMMouseScroll",A),C(),d},this.removePin=function(e){if(m){if(p===f&&C(!0),e||!l){var t=w.spacer.firstChild;if(t.hasAttribute(P)){var n=w.spacer.style,r={};["margin","marginLeft","marginRight","marginTop","marginBottom"].forEach(function(e){r[e]=n[e]||""}),R.css(t,r)}w.spacer.parentNode.insertBefore(t,w.spacer),w.spacer.parentNode.removeChild(w.spacer),m.parentNode.hasAttribute(P)||(R.css(m,m.___origStyle),delete m.___origStyle)}window.removeEventListener("scroll",L),window.removeEventListener("resize",L),window.removeEventListener("resize",T),m.removeEventListener("mousewheel",A),m.removeEventListener("DOMMouseScroll",A),m=void 0}return d};var N,O=[];return d.on("destroy.internal",function(e){d.removeClassToggle(e.reset)}),this.setClassToggle=function(e,t){var n=R.get.elements(e);return 0!==n.length&&R.type.String(t)&&(0<O.length&&d.removeClassToggle(),N=t,O=n,d.on("enter.internal_class leave.internal_class",function(e){var n="enter"===e.type?R.addClass:R.removeClass;O.forEach(function(e,t){n(e,N)})})),d},this.removeClassToggle=function(e){return e&&O.forEach(function(e,t){R.removeClass(e,N)}),d.off("start.internal_class end.internal_class"),N=void 0,O=[],d},function(){for(var e in h)r.hasOwnProperty(e)||delete h[e];for(var t in r)z(t);E()}(),d};var D={defaults:{duration:0,offset:0,triggerElement:void 0,triggerHook:.5,reverse:!0,loglevel:2},validate:{offset:function(e){if(e=parseFloat(e),!R.type.Number(e))throw 0;return e},triggerElement:function(e){if(e=e||void 0){var t=R.get.elements(e)[0];if(!t||!t.parentNode)throw 0;e=t}return e},triggerHook:function(e){var t={onCenter:.5,onEnter:1,onLeave:0};if(R.type.Number(e))e=Math.max(0,Math.min(parseFloat(e),1));else{if(!(e in t))throw 0;e=t[e]}return e},reverse:function(e){return!!e}},shifts:["duration","offset","triggerHook"]};_.Scene.addOption=function(e,t,n,r){e in D.defaults||(D.defaults[e]=t,D.validate[e]=n,r&&D.shifts.push(e))},_.Scene.extend=function(e){var t=this;_.Scene=function(){return t.apply(this,arguments),this.$super=R.extend({},this),e.apply(this,arguments)||this},R.extend(_.Scene,t),_.Scene.prototype=t.prototype,_.Scene.prototype.constructor=_.Scene},_.Event=function(e,t,n,r){for(var i in r=r||{})this[i]=r[i];return this.type=e,this.target=this.currentTarget=n,this.namespace=t||"",this.timeStamp=this.timestamp=Date.now(),this};var R=_._util=function(s){var n,e={},a=function(e){return parseFloat(e)||0},l=function(e){return e.currentStyle?e.currentStyle:s.getComputedStyle(e)},r=function(e,t,n,r){if((t=t===document?s:t)===s)r=!1;else if(!u.DomElement(t))return 0;e=e.charAt(0).toUpperCase()+e.substr(1).toLowerCase();var i=(n?t["offset"+e]||t["outer"+e]:t["client"+e]||t["inner"+e])||0;if(n&&r){var o=l(t);i+="Height"===e?a(o.marginTop)+a(o.marginBottom):a(o.marginLeft)+a(o.marginRight)}return i},c=function(e){return e.replace(/^[^a-z]+([a-z])/g,"$1").replace(/-([a-z])/g,function(e){return e[1].toUpperCase()})};e.extend=function(e){for(e=e||{},n=1;n<arguments.length;n++)if(arguments[n])for(var t in arguments[n])arguments[n].hasOwnProperty(t)&&(e[t]=arguments[n][t]);return e},e.isMarginCollapseType=function(e){return-1<["block","flex","list-item","table","-webkit-box"].indexOf(e)};var i=0,t=["ms","moz","webkit","o"],o=s.requestAnimationFrame,f=s.cancelAnimationFrame;for(n=0;!o&&n<4;++n)o=s[t[n]+"RequestAnimationFrame"],f=s[t[n]+"CancelAnimationFrame"]||s[t[n]+"CancelRequestAnimationFrame"];o||(o=function(e){var t=(new Date).getTime(),n=Math.max(0,16-(t-i)),r=s.setTimeout(function(){e(t+n)},n);return i=t+n,r}),f||(f=function(e){s.clearTimeout(e)}),e.rAF=o.bind(s),e.cAF=f.bind(s);var u=e.type=function(e){return Object.prototype.toString.call(e).replace(/^\[object (.+)\]$/,"$1").toLowerCase()};u.String=function(e){return"string"===u(e)},u.Function=function(e){return"function"===u(e)},u.Array=function(e){return Array.isArray(e)},u.Number=function(e){return!u.Array(e)&&0<=e-parseFloat(e)+1},u.DomElement=function(e){return"object"==typeof HTMLElement||"function"==typeof HTMLElement?e instanceof HTMLElement||e instanceof SVGElement:e&&"object"==typeof e&&null!==e&&1===e.nodeType&&"string"==typeof e.nodeName};var d=e.get={};return d.elements=function(e){var t=[];if(u.String(e))try{e=document.querySelectorAll(e)}catch(e){return t}if("nodelist"===u(e)||u.Array(e)||e instanceof NodeList)for(var n=0,r=t.length=e.length;n<r;n++){var i=e[n];t[n]=u.DomElement(i)?i:d.elements(i)}else(u.DomElement(e)||e===document||e===s)&&(t=[e]);return t},d.scrollTop=function(e){return e&&"number"==typeof e.scrollTop?e.scrollTop:s.pageYOffset||0},d.scrollLeft=function(e){return e&&"number"==typeof e.scrollLeft?e.scrollLeft:s.pageXOffset||0},d.width=function(e,t,n){return r("width",e,t,n)},d.height=function(e,t,n){return r("height",e,t,n)},d.offset=function(e,t){var n={top:0,left:0};if(e&&e.getBoundingClientRect){var r=e.getBoundingClientRect();n.top=r.top,n.left=r.left,t||(n.top+=d.scrollTop(),n.left+=d.scrollLeft())}return n},e.addClass=function(e,t){t&&(e.classList?e.classList.add(t):e.className+=" "+t)},e.removeClass=function(e,t){t&&(e.classList?e.classList.remove(t):e.className=e.className.replace(RegExp("(^|\\b)"+t.split(" ").join("|")+"(\\b|$)","gi")," "))},e.css=function(e,t){if(u.String(t))return l(e)[c(t)];if(u.Array(t)){var n={},r=l(e);return t.forEach(function(e,t){n[e]=r[c(e)]}),n}for(var i in t){var o=t[i];o==parseFloat(o)&&(o+="px"),e.style[c(i)]=o}},e}(window||{});return _});
/** * Swiper 6.8.1 * Most modern mobile touch slider and framework with hardware accelerated transitions * https://swiperjs.com * * Copyright 2014-2021 Vladimir Kharlampidi * * Released under the MIT License * * Released on: August 3, 2021 */ !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Swiper=t()}(this,(function(){"use strict";function e(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function t(){return(t=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var i in a)Object.prototype.hasOwnProperty.call(a,i)&&(e[i]=a[i])}return e}).apply(this,arguments)}function a(e){return null!==e&&"object"==typeof e&&"constructor"in e&&e.constructor===Object}function i(e,t){void 0===e&&(e={}),void 0===t&&(t={}),Object.keys(t).forEach((function(s){void 0===e[s]?e[s]=t[s]:a(t[s])&&a(e[s])&&Object.keys(t[s]).length>0&&i(e[s],t[s])}))}var s={body:{},addEventListener:function(){},removeEventListener:function(){},activeElement:{blur:function(){},nodeName:""},querySelector:function(){return null},querySelectorAll:function(){return[]},getElementById:function(){return null},createEvent:function(){return{initEvent:function(){}}},createElement:function(){return{children:[],childNodes:[],style:{},setAttribute:function(){},getElementsByTagName:function(){return[]}}},createElementNS:function(){return{}},importNode:function(){return null},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""}};function r(){var e="undefined"!=typeof document?document:{};return i(e,s),e}var n={document:s,navigator:{userAgent:""},location:{hash:"",host:"",hostname:"",href:"",origin:"",pathname:"",protocol:"",search:""},history:{replaceState:function(){},pushState:function(){},go:function(){},back:function(){}},CustomEvent:function(){return this},addEventListener:function(){},removeEventListener:function(){},getComputedStyle:function(){return{getPropertyValue:function(){return""}}},Image:function(){},Date:function(){},screen:{},setTimeout:function(){},clearTimeout:function(){},matchMedia:function(){return{}},requestAnimationFrame:function(e){return"undefined"==typeof setTimeout?(e(),null):setTimeout(e,0)},cancelAnimationFrame:function(e){"undefined"!=typeof setTimeout&&clearTimeout(e)}};function l(){var e="undefined"!=typeof window?window:{};return i(e,n),e}function o(e){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function u(e,t,a){return(u=p()?Reflect.construct:function(e,t,a){var i=[null];i.push.apply(i,t);var s=new(Function.bind.apply(e,i));return a&&d(s,a.prototype),s}).apply(null,arguments)}function c(e){var t="function"==typeof Map?new Map:void 0;return(c=function(e){if(null===e||(a=e,-1===Function.toString.call(a).indexOf("[native code]")))return e;var a;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,i)}function i(){return u(e,arguments,o(this).constructor)}return i.prototype=Object.create(e.prototype,{constructor:{value:i,enumerable:!1,writable:!0,configurable:!0}}),d(i,e)})(e)}var h=function(e){var t,a;function i(t){var a,i,s;return a=e.call.apply(e,[this].concat(t))||this,i=function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(a),s=i.__proto__,Object.defineProperty(i,"__proto__",{get:function(){return s},set:function(e){s.__proto__=e}}),a}return a=e,(t=i).prototype=Object.create(a.prototype),t.prototype.constructor=t,t.__proto__=a,i}(c(Array));function v(e){void 0===e&&(e=[]);var t=[];return e.forEach((function(e){Array.isArray(e)?t.push.apply(t,v(e)):t.push(e)})),t}function f(e,t){return Array.prototype.filter.call(e,t)}function m(e,t){var a=l(),i=r(),s=[];if(!t&&e instanceof h)return e;if(!e)return new h(s);if("string"==typeof e){var n=e.trim();if(n.indexOf("<")>=0&&n.indexOf(">")>=0){var o="div";0===n.indexOf("<li")&&(o="ul"),0===n.indexOf("<tr")&&(o="tbody"),0!==n.indexOf("<td")&&0!==n.indexOf("<th")||(o="tr"),0===n.indexOf("<tbody")&&(o="table"),0===n.indexOf("<option")&&(o="select");var d=i.createElement(o);d.innerHTML=n;for(var p=0;p<d.childNodes.length;p+=1)s.push(d.childNodes[p])}else s=function(e,t){if("string"!=typeof e)return[e];for(var a=[],i=t.querySelectorAll(e),s=0;s<i.length;s+=1)a.push(i[s]);return a}(e.trim(),t||i)}else if(e.nodeType||e===a||e===i)s.push(e);else if(Array.isArray(e)){if(e instanceof h)return e;s=e}return new h(function(e){for(var t=[],a=0;a<e.length;a+=1)-1===t.indexOf(e[a])&&t.push(e[a]);return t}(s))}m.fn=h.prototype;var g,b,w,y={addClass:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var i=v(t.map((function(e){return e.split(" ")})));return this.forEach((function(e){var t;(t=e.classList).add.apply(t,i)})),this},removeClass:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var i=v(t.map((function(e){return e.split(" ")})));return this.forEach((function(e){var t;(t=e.classList).remove.apply(t,i)})),this},hasClass:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var i=v(t.map((function(e){return e.split(" ")})));return f(this,(function(e){return i.filter((function(t){return e.classList.contains(t)})).length>0})).length>0},toggleClass:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var i=v(t.map((function(e){return e.split(" ")})));this.forEach((function(e){i.forEach((function(t){e.classList.toggle(t)}))}))},attr:function(e,t){if(1===arguments.length&&"string"==typeof e)return this[0]?this[0].getAttribute(e):void 0;for(var a=0;a<this.length;a+=1)if(2===arguments.length)this[a].setAttribute(e,t);else for(var i in e)this[a][i]=e[i],this[a].setAttribute(i,e[i]);return this},removeAttr:function(e){for(var t=0;t<this.length;t+=1)this[t].removeAttribute(e);return this},transform:function(e){for(var t=0;t<this.length;t+=1)this[t].style.transform=e;return this},transition:function(e){for(var t=0;t<this.length;t+=1)this[t].style.transitionDuration="string"!=typeof e?e+"ms":e;return this},on:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var i=t[0],s=t[1],r=t[2],n=t[3];function l(e){var t=e.target;if(t){var a=e.target.dom7EventData||[];if(a.indexOf(e)<0&&a.unshift(e),m(t).is(s))r.apply(t,a);else for(var i=m(t).parents(),n=0;n<i.length;n+=1)m(i[n]).is(s)&&r.apply(i[n],a)}}function o(e){var t=e&&e.target&&e.target.dom7EventData||[];t.indexOf(e)<0&&t.unshift(e),r.apply(this,t)}"function"==typeof t[1]&&(i=t[0],r=t[1],n=t[2],s=void 0),n||(n=!1);for(var d,p=i.split(" "),u=0;u<this.length;u+=1){var c=this[u];if(s)for(d=0;d<p.length;d+=1){var h=p[d];c.dom7LiveListeners||(c.dom7LiveListeners={}),c.dom7LiveListeners[h]||(c.dom7LiveListeners[h]=[]),c.dom7LiveListeners[h].push({listener:r,proxyListener:l}),c.addEventListener(h,l,n)}else for(d=0;d<p.length;d+=1){var v=p[d];c.dom7Listeners||(c.dom7Listeners={}),c.dom7Listeners[v]||(c.dom7Listeners[v]=[]),c.dom7Listeners[v].push({listener:r,proxyListener:o}),c.addEventListener(v,o,n)}}return this},off:function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var i=t[0],s=t[1],r=t[2],n=t[3];"function"==typeof t[1]&&(i=t[0],r=t[1],n=t[2],s=void 0),n||(n=!1);for(var l=i.split(" "),o=0;o<l.length;o+=1)for(var d=l[o],p=0;p<this.length;p+=1){var u=this[p],c=void 0;if(!s&&u.dom7Listeners?c=u.dom7Listeners[d]:s&&u.dom7LiveListeners&&(c=u.dom7LiveListeners[d]),c&&c.length)for(var h=c.length-1;h>=0;h-=1){var v=c[h];r&&v.listener===r||r&&v.listener&&v.listener.dom7proxy&&v.listener.dom7proxy===r?(u.removeEventListener(d,v.proxyListener,n),c.splice(h,1)):r||(u.removeEventListener(d,v.proxyListener,n),c.splice(h,1))}}return this},trigger:function(){for(var e=l(),t=arguments.length,a=new Array(t),i=0;i<t;i++)a[i]=arguments[i];for(var s=a[0].split(" "),r=a[1],n=0;n<s.length;n+=1)for(var o=s[n],d=0;d<this.length;d+=1){var p=this[d];if(e.CustomEvent){var u=new e.CustomEvent(o,{detail:r,bubbles:!0,cancelable:!0});p.dom7EventData=a.filter((function(e,t){return t>0})),p.dispatchEvent(u),p.dom7EventData=[],delete p.dom7EventData}}return this},transitionEnd:function(e){var t=this;return e&&t.on("transitionend",(function a(i){i.target===this&&(e.call(this,i),t.off("transitionend",a))})),this},outerWidth:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetWidth+parseFloat(t.getPropertyValue("margin-right"))+parseFloat(t.getPropertyValue("margin-left"))}return this[0].offsetWidth}return null},outerHeight:function(e){if(this.length>0){if(e){var t=this.styles();return this[0].offsetHeight+parseFloat(t.getPropertyValue("margin-top"))+parseFloat(t.getPropertyValue("margin-bottom"))}return this[0].offsetHeight}return null},styles:function(){var e=l();return this[0]?e.getComputedStyle(this[0],null):{}},offset:function(){if(this.length>0){var e=l(),t=r(),a=this[0],i=a.getBoundingClientRect(),s=t.body,n=a.clientTop||s.clientTop||0,o=a.clientLeft||s.clientLeft||0,d=a===e?e.scrollY:a.scrollTop,p=a===e?e.scrollX:a.scrollLeft;return{top:i.top+d-n,left:i.left+p-o}}return null},css:function(e,t){var a,i=l();if(1===arguments.length){if("string"!=typeof e){for(a=0;a<this.length;a+=1)for(var s in e)this[a].style[s]=e[s];return this}if(this[0])return i.getComputedStyle(this[0],null).getPropertyValue(e)}if(2===arguments.length&&"string"==typeof e){for(a=0;a<this.length;a+=1)this[a].style[e]=t;return this}return this},each:function(e){return e?(this.forEach((function(t,a){e.apply(t,[t,a])})),this):this},html:function(e){if(void 0===e)return this[0]?this[0].innerHTML:null;for(var t=0;t<this.length;t+=1)this[t].innerHTML=e;return this},text:function(e){if(void 0===e)return this[0]?this[0].textContent.trim():null;for(var t=0;t<this.length;t+=1)this[t].textContent=e;return this},is:function(e){var t,a,i=l(),s=r(),n=this[0];if(!n||void 0===e)return!1;if("string"==typeof e){if(n.matches)return n.matches(e);if(n.webkitMatchesSelector)return n.webkitMatchesSelector(e);if(n.msMatchesSelector)return n.msMatchesSelector(e);for(t=m(e),a=0;a<t.length;a+=1)if(t[a]===n)return!0;return!1}if(e===s)return n===s;if(e===i)return n===i;if(e.nodeType||e instanceof h){for(t=e.nodeType?[e]:e,a=0;a<t.length;a+=1)if(t[a]===n)return!0;return!1}return!1},index:function(){var e,t=this[0];if(t){for(e=0;null!==(t=t.previousSibling);)1===t.nodeType&&(e+=1);return e}},eq:function(e){if(void 0===e)return this;var t=this.length;if(e>t-1)return m([]);if(e<0){var a=t+e;return m(a<0?[]:[this[a]])}return m([this[e]])},append:function(){for(var e,t=r(),a=0;a<arguments.length;a+=1){e=a<0||arguments.length<=a?void 0:arguments[a];for(var i=0;i<this.length;i+=1)if("string"==typeof e){var s=t.createElement("div");for(s.innerHTML=e;s.firstChild;)this[i].appendChild(s.firstChild)}else if(e instanceof h)for(var n=0;n<e.length;n+=1)this[i].appendChild(e[n]);else this[i].appendChild(e)}return this},prepend:function(e){var t,a,i=r();for(t=0;t<this.length;t+=1)if("string"==typeof e){var s=i.createElement("div");for(s.innerHTML=e,a=s.childNodes.length-1;a>=0;a-=1)this[t].insertBefore(s.childNodes[a],this[t].childNodes[0])}else if(e instanceof h)for(a=0;a<e.length;a+=1)this[t].insertBefore(e[a],this[t].childNodes[0]);else this[t].insertBefore(e,this[t].childNodes[0]);return this},next:function(e){return this.length>0?e?this[0].nextElementSibling&&m(this[0].nextElementSibling).is(e)?m([this[0].nextElementSibling]):m([]):this[0].nextElementSibling?m([this[0].nextElementSibling]):m([]):m([])},nextAll:function(e){var t=[],a=this[0];if(!a)return m([]);for(;a.nextElementSibling;){var i=a.nextElementSibling;e?m(i).is(e)&&t.push(i):t.push(i),a=i}return m(t)},prev:function(e){if(this.length>0){var t=this[0];return e?t.previousElementSibling&&m(t.previousElementSibling).is(e)?m([t.previousElementSibling]):m([]):t.previousElementSibling?m([t.previousElementSibling]):m([])}return m([])},prevAll:function(e){var t=[],a=this[0];if(!a)return m([]);for(;a.previousElementSibling;){var i=a.previousElementSibling;e?m(i).is(e)&&t.push(i):t.push(i),a=i}return m(t)},parent:function(e){for(var t=[],a=0;a<this.length;a+=1)null!==this[a].parentNode&&(e?m(this[a].parentNode).is(e)&&t.push(this[a].parentNode):t.push(this[a].parentNode));return m(t)},parents:function(e){for(var t=[],a=0;a<this.length;a+=1)for(var i=this[a].parentNode;i;)e?m(i).is(e)&&t.push(i):t.push(i),i=i.parentNode;return m(t)},closest:function(e){var t=this;return void 0===e?m([]):(t.is(e)||(t=t.parents(e).eq(0)),t)},find:function(e){for(var t=[],a=0;a<this.length;a+=1){try{var i=this[a].querySelectorAll(e)}catch(t){console.log(e)}for(var s=0;s<i.length;s+=1)t.push(i[s])}return m(t)},children:function(e){for(var t=[],a=0;a<this.length;a+=1)for(var i=this[a].children,s=0;s<i.length;s+=1)e&&!m(i[s]).is(e)||t.push(i[s]);return m(t)},filter:function(e){return m(f(this,e))},remove:function(){for(var e=0;e<this.length;e+=1)this[e].parentNode&&this[e].parentNode.removeChild(this[e]);return this}};function E(e,t){return void 0===t&&(t=0),setTimeout(e,t)}function x(){return Date.now()}function T(e,t){void 0===t&&(t="x");var a,i,s,r=l(),n=function(e){var t,a=l();return a.getComputedStyle&&(t=a.getComputedStyle(e,null)),!t&&e.currentStyle&&(t=e.currentStyle),t||(t=e.style),t}(e);return r.WebKitCSSMatrix?((i=n.transform||n.webkitTransform).split(",").length>6&&(i=i.split(", ").map((function(e){return e.replace(",",".")})).join(", ")),s=new r.WebKitCSSMatrix("none"===i?"":i)):a=(s=n.MozTransform||n.OTransform||n.MsTransform||n.msTransform||n.transform||n.getPropertyValue("transform").replace("translate(","matrix(1, 0, 0, 1,")).toString().split(","),"x"===t&&(i=r.WebKitCSSMatrix?s.m41:16===a.length?parseFloat(a[12]):parseFloat(a[4])),"y"===t&&(i=r.WebKitCSSMatrix?s.m42:16===a.length?parseFloat(a[13]):parseFloat(a[5])),i||0}function C(e){return"object"==typeof e&&null!==e&&e.constructor&&"Object"===Object.prototype.toString.call(e).slice(8,-1)}function S(e){return"undefined"!=typeof window&&void 0!==window.HTMLElement?e instanceof HTMLElement:e&&(1===e.nodeType||11===e.nodeType)}function M(){for(var e=Object(arguments.length<=0?void 0:arguments[0]),t=["__proto__","constructor","prototype"],a=1;a<arguments.length;a+=1){var i=a<0||arguments.length<=a?void 0:arguments[a];if(null!=i&&!S(i))for(var s=Object.keys(Object(i)).filter((function(e){return t.indexOf(e)<0})),r=0,n=s.length;r<n;r+=1){var l=s[r],o=Object.getOwnPropertyDescriptor(i,l);void 0!==o&&o.enumerable&&(C(e[l])&&C(i[l])?i[l].__swiper__?e[l]=i[l]:M(e[l],i[l]):!C(e[l])&&C(i[l])?(e[l]={},i[l].__swiper__?e[l]=i[l]:M(e[l],i[l])):e[l]=i[l])}}return e}function z(e,t){Object.keys(t).forEach((function(a){C(t[a])&&Object.keys(t[a]).forEach((function(i){"function"==typeof t[a][i]&&(t[a][i]=t[a][i].bind(e))})),e[a]=t[a]}))}function P(e){return void 0===e&&(e=""),"."+e.trim().replace(/([\.:\/])/g,"\\$1").replace(/ /g,".")}function k(e,t,a,i){var s=r();return a&&Object.keys(i).forEach((function(a){if(!t[a]&&!0===t.auto){var r=s.createElement("div");r.className=i[a],e.append(r),t[a]=r}})),t}function $(){return g||(g=function(){var e=l(),t=r();return{touch:!!("ontouchstart"in e||e.DocumentTouch&&t instanceof e.DocumentTouch),pointerEvents:!!e.PointerEvent&&"maxTouchPoints"in e.navigator&&e.navigator.maxTouchPoints>=0,observer:"MutationObserver"in e||"WebkitMutationObserver"in e,passiveListener:function(){var t=!1;try{var a=Object.defineProperty({},"passive",{get:function(){t=!0}});e.addEventListener("testPassiveListener",null,a)}catch(e){}return t}(),gestures:"ongesturestart"in e}}()),g}function L(e){return void 0===e&&(e={}),b||(b=function(e){var t=(void 0===e?{}:e).userAgent,a=$(),i=l(),s=i.navigator.platform,r=t||i.navigator.userAgent,n={ios:!1,android:!1},o=i.screen.width,d=i.screen.height,p=r.match(/(Android);?[\s\/]+([\d.]+)?/),u=r.match(/(iPad).*OS\s([\d_]+)/),c=r.match(/(iPod)(.*OS\s([\d_]+))?/),h=!u&&r.match(/(iPhone\sOS|iOS)\s([\d_]+)/),v="Win32"===s,f="MacIntel"===s;return!u&&f&&a.touch&&["1024x1366","1366x1024","834x1194","1194x834","834x1112","1112x834","768x1024","1024x768","820x1180","1180x820","810x1080","1080x810"].indexOf(o+"x"+d)>=0&&((u=r.match(/(Version)\/([\d.]+)/))||(u=[0,1,"13_0_0"]),f=!1),p&&!v&&(n.os="android",n.android=!0),(u||h||c)&&(n.os="ios",n.ios=!0),n}(e)),b}function I(){return w||(w=function(){var e,t=l();return{isEdge:!!t.navigator.userAgent.match(/Edge/g),isSafari:(e=t.navigator.userAgent.toLowerCase(),e.indexOf("safari")>=0&&e.indexOf("chrome")<0&&e.indexOf("android")<0),isWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(t.navigator.userAgent)}}()),w}Object.keys(y).forEach((function(e){Object.defineProperty(m.fn,e,{value:y[e],writable:!0})}));var O={name:"resize",create:function(){var e=this;M(e,{resize:{observer:null,createObserver:function(){e&&!e.destroyed&&e.initialized&&(e.resize.observer=new ResizeObserver((function(t){var a=e.width,i=e.height,s=a,r=i;t.forEach((function(t){var a=t.contentBoxSize,i=t.contentRect,n=t.target;n&&n!==e.el||(s=i?i.width:(a[0]||a).inlineSize,r=i?i.height:(a[0]||a).blockSize)})),s===a&&r===i||e.resize.resizeHandler()})),e.resize.observer.observe(e.el))},removeObserver:function(){e.resize.observer&&e.resize.observer.unobserve&&e.el&&(e.resize.observer.unobserve(e.el),e.resize.observer=null)},resizeHandler:function(){e&&!e.destroyed&&e.initialized&&(e.emit("beforeResize"),e.emit("resize"))},orientationChangeHandler:function(){e&&!e.destroyed&&e.initialized&&e.emit("orientationchange")}}})},on:{init:function(e){var t=l();e.params.resizeObserver&&void 0!==l().ResizeObserver?e.resize.createObserver():(t.addEventListener("resize",e.resize.resizeHandler),t.addEventListener("orientationchange",e.resize.orientationChangeHandler))},destroy:function(e){var t=l();e.resize.removeObserver(),t.removeEventListener("resize",e.resize.resizeHandler),t.removeEventListener("orientationchange",e.resize.orientationChangeHandler)}}},A={attach:function(e,t){void 0===t&&(t={});var a=l(),i=this,s=new(a.MutationObserver||a.WebkitMutationObserver)((function(e){if(1!==e.length){var t=function(){i.emit("observerUpdate",e[0])};a.requestAnimationFrame?a.requestAnimationFrame(t):a.setTimeout(t,0)}else i.emit("observerUpdate",e[0])}));s.observe(e,{attributes:void 0===t.attributes||t.attributes,childList:void 0===t.childList||t.childList,characterData:void 0===t.characterData||t.characterData}),i.observer.observers.push(s)},init:function(){var e=this;if(e.support.observer&&e.params.observer){if(e.params.observeParents)for(var t=e.$el.parents(),a=0;a<t.length;a+=1)e.observer.attach(t[a]);e.observer.attach(e.$el[0],{childList:e.params.observeSlideChildren}),e.observer.attach(e.$wrapperEl[0],{attributes:!1})}},destroy:function(){this.observer.observers.forEach((function(e){e.disconnect()})),this.observer.observers=[]}},D={name:"observer",params:{observer:!1,observeParents:!1,observeSlideChildren:!1},create:function(){z(this,{observer:t({},A,{observers:[]})})},on:{init:function(e){e.observer.init()},destroy:function(e){e.observer.destroy()}}};function N(e){var t=this,a=r(),i=l(),s=t.touchEventsData,n=t.params,o=t.touches;if(t.enabled&&(!t.animating||!n.preventInteractionOnTransition)){var d=e;d.originalEvent&&(d=d.originalEvent);var p=m(d.target);if(("wrapper"!==n.touchEventsTarget||p.closest(t.wrapperEl).length)&&(s.isTouchEvent="touchstart"===d.type,(s.isTouchEvent||!("which"in d)||3!==d.which)&&!(!s.isTouchEvent&&"button"in d&&d.button>0||s.isTouched&&s.isMoved))){!!n.noSwipingClass&&""!==n.noSwipingClass&&d.target&&d.target.shadowRoot&&e.path&&e.path[0]&&(p=m(e.path[0]));var u=n.noSwipingSelector?n.noSwipingSelector:"."+n.noSwipingClass,c=!(!d.target||!d.target.shadowRoot);if(n.noSwiping&&(c?function(e,t){return void 0===t&&(t=this),function t(a){return a&&a!==r()&&a!==l()?(a.assignedSlot&&(a=a.assignedSlot),a.closest(e)||t(a.getRootNode().host)):null}(t)}(u,d.target):p.closest(u)[0]))t.allowClick=!0;else if(!n.swipeHandler||p.closest(n.swipeHandler)[0]){o.currentX="touchstart"===d.type?d.targetTouches[0].pageX:d.pageX,o.currentY="touchstart"===d.type?d.targetTouches[0].pageY:d.pageY;var h=o.currentX,v=o.currentY,f=n.edgeSwipeDetection||n.iOSEdgeSwipeDetection,g=n.edgeSwipeThreshold||n.iOSEdgeSwipeThreshold;if(f&&(h<=g||h>=i.innerWidth-g)){if("prevent"!==f)return;e.preventDefault()}if(M(s,{isTouched:!0,isMoved:!1,allowTouchCallbacks:!0,isScrolling:void 0,startMoving:void 0}),o.startX=h,o.startY=v,s.touchStartTime=x(),t.allowClick=!0,t.updateSize(),t.swipeDirection=void 0,n.threshold>0&&(s.allowThresholdMove=!1),"touchstart"!==d.type){var b=!0;p.is(s.focusableElements)&&(b=!1),a.activeElement&&m(a.activeElement).is(s.focusableElements)&&a.activeElement!==p[0]&&a.activeElement.blur();var w=b&&t.allowTouchMove&&n.touchStartPreventDefault;!n.touchStartForcePreventDefault&&!w||p[0].isContentEditable||d.preventDefault()}t.emit("touchStart",d)}}}}function G(e){var t=r(),a=this,i=a.touchEventsData,s=a.params,n=a.touches,l=a.rtlTranslate;if(a.enabled){var o=e;if(o.originalEvent&&(o=o.originalEvent),i.isTouched){if(!i.isTouchEvent||"touchmove"===o.type){var d="touchmove"===o.type&&o.targetTouches&&(o.targetTouches[0]||o.changedTouches[0]),p="touchmove"===o.type?d.pageX:o.pageX,u="touchmove"===o.type?d.pageY:o.pageY;if(o.preventedByNestedSwiper)return n.startX=p,void(n.startY=u);if(!a.allowTouchMove)return a.allowClick=!1,void(i.isTouched&&(M(n,{startX:p,startY:u,currentX:p,currentY:u}),i.touchStartTime=x()));if(i.isTouchEvent&&s.touchReleaseOnEdges&&!s.loop)if(a.isVertical()){if(u<n.startY&&a.translate<=a.maxTranslate()||u>n.startY&&a.translate>=a.minTranslate())return i.isTouched=!1,void(i.isMoved=!1)}else if(p<n.startX&&a.translate<=a.maxTranslate()||p>n.startX&&a.translate>=a.minTranslate())return;if(i.isTouchEvent&&t.activeElement&&o.target===t.activeElement&&m(o.target).is(i.focusableElements))return i.isMoved=!0,void(a.allowClick=!1);if(i.allowTouchCallbacks&&a.emit("touchMove",o),!(o.targetTouches&&o.targetTouches.length>1)){n.currentX=p,n.currentY=u;var c=n.currentX-n.startX,h=n.currentY-n.startY;if(!(a.params.threshold&&Math.sqrt(Math.pow(c,2)+Math.pow(h,2))<a.params.threshold)){var v;if(void 0===i.isScrolling)a.isHorizontal()&&n.currentY===n.startY||a.isVertical()&&n.currentX===n.startX?i.isScrolling=!1:c*c+h*h>=25&&(v=180*Math.atan2(Math.abs(h),Math.abs(c))/Math.PI,i.isScrolling=a.isHorizontal()?v>s.touchAngle:90-v>s.touchAngle);if(i.isScrolling&&a.emit("touchMoveOpposite",o),void 0===i.startMoving&&(n.currentX===n.startX&&n.currentY===n.startY||(i.startMoving=!0)),i.isScrolling)i.isTouched=!1;else if(i.startMoving){a.allowClick=!1,!s.cssMode&&o.cancelable&&o.preventDefault(),s.touchMoveStopPropagation&&!s.nested&&o.stopPropagation(),i.isMoved||(s.loop&&a.loopFix(),i.startTranslate=a.getTranslate(),a.setTransition(0),a.animating&&a.$wrapperEl.trigger("webkitTransitionEnd transitionend"),i.allowMomentumBounce=!1,!s.grabCursor||!0!==a.allowSlideNext&&!0!==a.allowSlidePrev||a.setGrabCursor(!0),a.emit("sliderFirstMove",o)),a.emit("sliderMove",o),i.isMoved=!0;var f=a.isHorizontal()?c:h;n.diff=f,f*=s.touchRatio,l&&(f=-f),a.swipeDirection=f>0?"prev":"next",i.currentTranslate=f+i.startTranslate;var g=!0,b=s.resistanceRatio;if(s.touchReleaseOnEdges&&(b=0),f>0&&i.currentTranslate>a.minTranslate()?(g=!1,s.resistance&&(i.currentTranslate=a.minTranslate()-1+Math.pow(-a.minTranslate()+i.startTranslate+f,b))):f<0&&i.currentTranslate<a.maxTranslate()&&(g=!1,s.resistance&&(i.currentTranslate=a.maxTranslate()+1-Math.pow(a.maxTranslate()-i.startTranslate-f,b))),g&&(o.preventedByNestedSwiper=!0),!a.allowSlideNext&&"next"===a.swipeDirection&&i.currentTranslate<i.startTranslate&&(i.currentTranslate=i.startTranslate),!a.allowSlidePrev&&"prev"===a.swipeDirection&&i.currentTranslate>i.startTranslate&&(i.currentTranslate=i.startTranslate),a.allowSlidePrev||a.allowSlideNext||(i.currentTranslate=i.startTranslate),s.threshold>0){if(!(Math.abs(f)>s.threshold||i.allowThresholdMove))return void(i.currentTranslate=i.startTranslate);if(!i.allowThresholdMove)return i.allowThresholdMove=!0,n.startX=n.currentX,n.startY=n.currentY,i.currentTranslate=i.startTranslate,void(n.diff=a.isHorizontal()?n.currentX-n.startX:n.currentY-n.startY)}s.followFinger&&!s.cssMode&&((s.freeMode||s.watchSlidesProgress||s.watchSlidesVisibility)&&(a.updateActiveIndex(),a.updateSlidesClasses()),s.freeMode&&(0===i.velocities.length&&i.velocities.push({position:n[a.isHorizontal()?"startX":"startY"],time:i.touchStartTime}),i.velocities.push({position:n[a.isHorizontal()?"currentX":"currentY"],time:x()})),a.updateProgress(i.currentTranslate),a.setTranslate(i.currentTranslate))}}}}}else i.startMoving&&i.isScrolling&&a.emit("touchMoveOpposite",o)}}function B(e){var t=this,a=t.touchEventsData,i=t.params,s=t.touches,r=t.rtlTranslate,n=t.$wrapperEl,l=t.slidesGrid,o=t.snapGrid;if(t.enabled){var d=e;if(d.originalEvent&&(d=d.originalEvent),a.allowTouchCallbacks&&t.emit("touchEnd",d),a.allowTouchCallbacks=!1,!a.isTouched)return a.isMoved&&i.grabCursor&&t.setGrabCursor(!1),a.isMoved=!1,void(a.startMoving=!1);i.grabCursor&&a.isMoved&&a.isTouched&&(!0===t.allowSlideNext||!0===t.allowSlidePrev)&&t.setGrabCursor(!1);var p,u=x(),c=u-a.touchStartTime;if(t.allowClick&&(t.updateClickedSlide(d),t.emit("tap click",d),c<300&&u-a.lastClickTime<300&&t.emit("doubleTap doubleClick",d)),a.lastClickTime=x(),E((function(){t.destroyed||(t.allowClick=!0)})),!a.isTouched||!a.isMoved||!t.swipeDirection||0===s.diff||a.currentTranslate===a.startTranslate)return a.isTouched=!1,a.isMoved=!1,void(a.startMoving=!1);if(a.isTouched=!1,a.isMoved=!1,a.startMoving=!1,p=i.followFinger?r?t.translate:-t.translate:-a.currentTranslate,!i.cssMode)if(i.freeMode){if(p<-t.minTranslate())return void t.slideTo(t.activeIndex);if(p>-t.maxTranslate())return void(t.slides.length<o.length?t.slideTo(o.length-1):t.slideTo(t.slides.length-1));if(i.freeModeMomentum){if(a.velocities.length>1){var h=a.velocities.pop(),v=a.velocities.pop(),f=h.position-v.position,m=h.time-v.time;t.velocity=f/m,t.velocity/=2,Math.abs(t.velocity)<i.freeModeMinimumVelocity&&(t.velocity=0),(m>150||x()-h.time>300)&&(t.velocity=0)}else t.velocity=0;t.velocity*=i.freeModeMomentumVelocityRatio,a.velocities.length=0;var g=1e3*i.freeModeMomentumRatio,b=t.velocity*g,w=t.translate+b;r&&(w=-w);var y,T,C=!1,S=20*Math.abs(t.velocity)*i.freeModeMomentumBounceRatio;if(w<t.maxTranslate())i.freeModeMomentumBounce?(w+t.maxTranslate()<-S&&(w=t.maxTranslate()-S),y=t.maxTranslate(),C=!0,a.allowMomentumBounce=!0):w=t.maxTranslate(),i.loop&&i.centeredSlides&&(T=!0);else if(w>t.minTranslate())i.freeModeMomentumBounce?(w-t.minTranslate()>S&&(w=t.minTranslate()+S),y=t.minTranslate(),C=!0,a.allowMomentumBounce=!0):w=t.minTranslate(),i.loop&&i.centeredSlides&&(T=!0);else if(i.freeModeSticky){for(var M,z=0;z<o.length;z+=1)if(o[z]>-w){M=z;break}w=-(w=Math.abs(o[M]-w)<Math.abs(o[M-1]-w)||"next"===t.swipeDirection?o[M]:o[M-1])}if(T&&t.once("transitionEnd",(function(){t.loopFix()})),0!==t.velocity){if(g=r?Math.abs((-w-t.translate)/t.velocity):Math.abs((w-t.translate)/t.velocity),i.freeModeSticky){var P=Math.abs((r?-w:w)-t.translate),k=t.slidesSizesGrid[t.activeIndex];g=P<k?i.speed:P<2*k?1.5*i.speed:2.5*i.speed}}else if(i.freeModeSticky)return void t.slideToClosest();i.freeModeMomentumBounce&&C?(t.updateProgress(y),t.setTransition(g),t.setTranslate(w),t.transitionStart(!0,t.swipeDirection),t.animating=!0,n.transitionEnd((function(){t&&!t.destroyed&&a.allowMomentumBounce&&(t.emit("momentumBounce"),t.setTransition(i.speed),setTimeout((function(){t.setTranslate(y),n.transitionEnd((function(){t&&!t.destroyed&&t.transitionEnd()}))}),0))}))):t.velocity?(t.updateProgress(w),t.setTransition(g),t.setTranslate(w),t.transitionStart(!0,t.swipeDirection),t.animating||(t.animating=!0,n.transitionEnd((function(){t&&!t.destroyed&&t.transitionEnd()})))):(t.emit("_freeModeNoMomentumRelease"),t.updateProgress(w)),t.updateActiveIndex(),t.updateSlidesClasses()}else{if(i.freeModeSticky)return void t.slideToClosest();i.freeMode&&t.emit("_freeModeNoMomentumRelease")}(!i.freeModeMomentum||c>=i.longSwipesMs)&&(t.updateProgress(),t.updateActiveIndex(),t.updateSlidesClasses())}else{for(var $=0,L=t.slidesSizesGrid[0],I=0;I<l.length;I+=I<i.slidesPerGroupSkip?1:i.slidesPerGroup){var O=I<i.slidesPerGroupSkip-1?1:i.slidesPerGroup;void 0!==l[I+O]?p>=l[I]&&p<l[I+O]&&($=I,L=l[I+O]-l[I]):p>=l[I]&&($=I,L=l[l.length-1]-l[l.length-2])}var A=(p-l[$])/L,D=$<i.slidesPerGroupSkip-1?1:i.slidesPerGroup;if(c>i.longSwipesMs){if(!i.longSwipes)return void t.slideTo(t.activeIndex);"next"===t.swipeDirection&&(A>=i.longSwipesRatio?t.slideTo($+D):t.slideTo($)),"prev"===t.swipeDirection&&(A>1-i.longSwipesRatio?t.slideTo($+D):t.slideTo($))}else{if(!i.shortSwipes)return void t.slideTo(t.activeIndex);t.navigation&&(d.target===t.navigation.nextEl||d.target===t.navigation.prevEl)?d.target===t.navigation.nextEl?t.slideTo($+D):t.slideTo($):("next"===t.swipeDirection&&t.slideTo($+D),"prev"===t.swipeDirection&&t.slideTo($))}}}}function H(){var e=this,t=e.params,a=e.el;if(!a||0!==a.offsetWidth){t.breakpoints&&e.setBreakpoint();var i=e.allowSlideNext,s=e.allowSlidePrev,r=e.snapGrid;e.allowSlideNext=!0,e.allowSlidePrev=!0,e.updateSize(),e.updateSlides(),e.updateSlidesClasses(),("auto"===t.slidesPerView||t.slidesPerView>1)&&e.isEnd&&!e.isBeginning&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0),e.autoplay&&e.autoplay.running&&e.autoplay.paused&&e.autoplay.run(),e.allowSlidePrev=s,e.allowSlideNext=i,e.params.watchOverflow&&r!==e.snapGrid&&e.checkOverflow()}}function R(e){var t=this;t.enabled&&(t.allowClick||(t.params.preventClicks&&e.preventDefault(),t.params.preventClicksPropagation&&t.animating&&(e.stopPropagation(),e.stopImmediatePropagation())))}function X(){var e=this,t=e.wrapperEl,a=e.rtlTranslate;if(e.enabled){e.previousTranslate=e.translate,e.isHorizontal()?e.translate=a?t.scrollWidth-t.offsetWidth-t.scrollLeft:-t.scrollLeft:e.translate=-t.scrollTop,-0===e.translate&&(e.translate=0),e.updateActiveIndex(),e.updateSlidesClasses();var i=e.maxTranslate()-e.minTranslate();(0===i?0:(e.translate-e.minTranslate())/i)!==e.progress&&e.updateProgress(a?-e.translate:e.translate),e.emit("setTranslate",e.translate,!1)}}var Y=!1;function V(){}var W={init:!0,direction:"horizontal",touchEventsTarget:"container",initialSlide:0,speed:300,cssMode:!1,updateOnWindowResize:!0,resizeObserver:!1,nested:!1,createElements:!1,enabled:!0,focusableElements:"input, select, option, textarea, button, video, label",width:null,height:null,preventInteractionOnTransition:!1,userAgent:null,url:null,edgeSwipeDetection:!1,edgeSwipeThreshold:20,freeMode:!1,freeModeMomentum:!0,freeModeMomentumRatio:1,freeModeMomentumBounce:!0,freeModeMomentumBounceRatio:1,freeModeMomentumVelocityRatio:1,freeModeSticky:!1,freeModeMinimumVelocity:.02,autoHeight:!1,setWrapperSize:!1,virtualTranslate:!1,effect:"slide",breakpoints:void 0,breakpointsBase:"window",spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:"column",slidesPerGroup:1,slidesPerGroupSkip:0,centeredSlides:!1,centeredSlidesBounds:!1,slidesOffsetBefore:0,slidesOffsetAfter:0,normalizeSlideIndex:!0,centerInsufficientSlides:!1,watchOverflow:!1,roundLengths:!1,touchRatio:1,touchAngle:45,simulateTouch:!0,shortSwipes:!0,longSwipes:!0,longSwipesRatio:.5,longSwipesMs:300,followFinger:!0,allowTouchMove:!0,threshold:0,touchMoveStopPropagation:!1,touchStartPreventDefault:!0,touchStartForcePreventDefault:!1,touchReleaseOnEdges:!1,uniqueNavElements:!0,resistance:!0,resistanceRatio:.85,watchSlidesProgress:!1,watchSlidesVisibility:!1,grabCursor:!1,preventClicks:!0,preventClicksPropagation:!0,slideToClickedSlide:!1,preloadImages:!0,updateOnImagesReady:!0,loop:!1,loopAdditionalSlides:0,loopedSlides:null,loopFillGroupWithBlank:!1,loopPreventsSlide:!0,allowSlidePrev:!0,allowSlideNext:!0,swipeHandler:null,noSwiping:!0,noSwipingClass:"swiper-no-swiping",noSwipingSelector:null,passiveListeners:!0,containerModifierClass:"swiper-container-",slideClass:"swiper-slide",slideBlankClass:"swiper-slide-invisible-blank",slideActiveClass:"swiper-slide-active",slideDuplicateActiveClass:"swiper-slide-duplicate-active",slideVisibleClass:"swiper-slide-visible",slideDuplicateClass:"swiper-slide-duplicate",slideNextClass:"swiper-slide-next",slideDuplicateNextClass:"swiper-slide-duplicate-next",slidePrevClass:"swiper-slide-prev",slideDuplicatePrevClass:"swiper-slide-duplicate-prev",wrapperClass:"swiper-wrapper",runCallbacksOnInit:!0,_emitClasses:!1},F={modular:{useParams:function(e){var t=this;t.modules&&Object.keys(t.modules).forEach((function(a){var i=t.modules[a];i.params&&M(e,i.params)}))},useModules:function(e){void 0===e&&(e={});var t=this;t.modules&&Object.keys(t.modules).forEach((function(a){var i=t.modules[a],s=e[a]||{};i.on&&t.on&&Object.keys(i.on).forEach((function(e){t.on(e,i.on[e])})),i.create&&i.create.bind(t)(s)}))}},eventsEmitter:{on:function(e,t,a){var i=this;if("function"!=typeof t)return i;var s=a?"unshift":"push";return e.split(" ").forEach((function(e){i.eventsListeners[e]||(i.eventsListeners[e]=[]),i.eventsListeners[e][s](t)})),i},once:function(e,t,a){var i=this;if("function"!=typeof t)return i;function s(){i.off(e,s),s.__emitterProxy&&delete s.__emitterProxy;for(var a=arguments.length,r=new Array(a),n=0;n<a;n++)r[n]=arguments[n];t.apply(i,r)}return s.__emitterProxy=t,i.on(e,s,a)},onAny:function(e,t){var a=this;if("function"!=typeof e)return a;var i=t?"unshift":"push";return a.eventsAnyListeners.indexOf(e)<0&&a.eventsAnyListeners[i](e),a},offAny:function(e){var t=this;if(!t.eventsAnyListeners)return t;var a=t.eventsAnyListeners.indexOf(e);return a>=0&&t.eventsAnyListeners.splice(a,1),t},off:function(e,t){var a=this;return a.eventsListeners?(e.split(" ").forEach((function(e){void 0===t?a.eventsListeners[e]=[]:a.eventsListeners[e]&&a.eventsListeners[e].forEach((function(i,s){(i===t||i.__emitterProxy&&i.__emitterProxy===t)&&a.eventsListeners[e].splice(s,1)}))})),a):a},emit:function(){var e,t,a,i=this;if(!i.eventsListeners)return i;for(var s=arguments.length,r=new Array(s),n=0;n<s;n++)r[n]=arguments[n];"string"==typeof r[0]||Array.isArray(r[0])?(e=r[0],t=r.slice(1,r.length),a=i):(e=r[0].events,t=r[0].data,a=r[0].context||i),t.unshift(a);var l=Array.isArray(e)?e:e.split(" ");return l.forEach((function(e){i.eventsAnyListeners&&i.eventsAnyListeners.length&&i.eventsAnyListeners.forEach((function(i){i.apply(a,[e].concat(t))})),i.eventsListeners&&i.eventsListeners[e]&&i.eventsListeners[e].forEach((function(e){e.apply(a,t)}))})),i}},update:{updateSize:function(){var e,t,a=this,i=a.$el;e=void 0!==a.params.width&&null!==a.params.width?a.params.width:i[0].clientWidth,t=void 0!==a.params.height&&null!==a.params.height?a.params.height:i[0].clientHeight,0===e&&a.isHorizontal()||0===t&&a.isVertical()||(e=e-parseInt(i.css("padding-left")||0,10)-parseInt(i.css("padding-right")||0,10),t=t-parseInt(i.css("padding-top")||0,10)-parseInt(i.css("padding-bottom")||0,10),Number.isNaN(e)&&(e=0),Number.isNaN(t)&&(t=0),M(a,{width:e,height:t,size:a.isHorizontal()?e:t}))},updateSlides:function(){var e=this;function t(t){return e.isHorizontal()?t:{width:"height","margin-top":"margin-left","margin-bottom ":"margin-right","margin-left":"margin-top","margin-right":"margin-bottom","padding-left":"padding-top","padding-right":"padding-bottom",marginRight:"marginBottom"}[t]}function a(e,a){return parseFloat(e.getPropertyValue(t(a))||0)}var i=e.params,s=e.$wrapperEl,r=e.size,n=e.rtlTranslate,l=e.wrongRTL,o=e.virtual&&i.virtual.enabled,d=o?e.virtual.slides.length:e.slides.length,p=s.children("."+e.params.slideClass),u=o?e.virtual.slides.length:p.length,c=[],h=[],v=[],f=i.slidesOffsetBefore;"function"==typeof f&&(f=i.slidesOffsetBefore.call(e));var m=i.slidesOffsetAfter;"function"==typeof m&&(m=i.slidesOffsetAfter.call(e));var g=e.snapGrid.length,b=e.slidesGrid.length,w=i.spaceBetween,y=-f,E=0,x=0;if(void 0!==r){var T,C;"string"==typeof w&&w.indexOf("%")>=0&&(w=parseFloat(w.replace("%",""))/100*r),e.virtualSize=-w,n?p.css({marginLeft:"",marginBottom:"",marginTop:""}):p.css({marginRight:"",marginBottom:"",marginTop:""}),i.slidesPerColumn>1&&(T=Math.floor(u/i.slidesPerColumn)===u/e.params.slidesPerColumn?u:Math.ceil(u/i.slidesPerColumn)*i.slidesPerColumn,"auto"!==i.slidesPerView&&"row"===i.slidesPerColumnFill&&(T=Math.max(T,i.slidesPerView*i.slidesPerColumn)));for(var S,z,P,k=i.slidesPerColumn,$=T/k,L=Math.floor(u/i.slidesPerColumn),I=0;I<u;I+=1){C=0;var O=p.eq(I);if(i.slidesPerColumn>1){var A=void 0,D=void 0,N=void 0;if("row"===i.slidesPerColumnFill&&i.slidesPerGroup>1){var G=Math.floor(I/(i.slidesPerGroup*i.slidesPerColumn)),B=I-i.slidesPerColumn*i.slidesPerGroup*G,H=0===G?i.slidesPerGroup:Math.min(Math.ceil((u-G*k*i.slidesPerGroup)/k),i.slidesPerGroup);A=(D=B-(N=Math.floor(B/H))*H+G*i.slidesPerGroup)+N*T/k,O.css({"-webkit-box-ordinal-group":A,"-moz-box-ordinal-group":A,"-ms-flex-order":A,"-webkit-order":A,order:A})}else"column"===i.slidesPerColumnFill?(N=I-(D=Math.floor(I/k))*k,(D>L||D===L&&N===k-1)&&(N+=1)>=k&&(N=0,D+=1)):D=I-(N=Math.floor(I/$))*$;O.css(t("margin-top"),0!==N?i.spaceBetween&&i.spaceBetween+"px":"")}if("none"!==O.css("display")){if("auto"===i.slidesPerView){var R=getComputedStyle(O[0]),X=O[0].style.transform,Y=O[0].style.webkitTransform;if(X&&(O[0].style.transform="none"),Y&&(O[0].style.webkitTransform="none"),i.roundLengths)C=e.isHorizontal()?O.outerWidth(!0):O.outerHeight(!0);else{var V=a(R,"width"),W=a(R,"padding-left"),F=a(R,"padding-right"),_=a(R,"margin-left"),q=a(R,"margin-right"),j=R.getPropertyValue("box-sizing");if(j&&"border-box"===j)C=V+_+q;else{var U=O[0],K=U.clientWidth;C=V+W+F+_+q+(U.offsetWidth-K)}}X&&(O[0].style.transform=X),Y&&(O[0].style.webkitTransform=Y),i.roundLengths&&(C=Math.floor(C))}else C=(r-(i.slidesPerView-1)*w)/i.slidesPerView,i.roundLengths&&(C=Math.floor(C)),p[I]&&(p[I].style[t("width")]=C+"px");p[I]&&(p[I].swiperSlideSize=C),v.push(C),i.centeredSlides?(y=y+C/2+E/2+w,0===E&&0!==I&&(y=y-r/2-w),0===I&&(y=y-r/2-w),Math.abs(y)<.001&&(y=0),i.roundLengths&&(y=Math.floor(y)),x%i.slidesPerGroup==0&&c.push(y),h.push(y)):(i.roundLengths&&(y=Math.floor(y)),(x-Math.min(e.params.slidesPerGroupSkip,x))%e.params.slidesPerGroup==0&&c.push(y),h.push(y),y=y+C+w),e.virtualSize+=C+w,E=C,x+=1}}if(e.virtualSize=Math.max(e.virtualSize,r)+m,n&&l&&("slide"===i.effect||"coverflow"===i.effect)&&s.css({width:e.virtualSize+i.spaceBetween+"px"}),i.setWrapperSize)s.css(((z={})[t("width")]=e.virtualSize+i.spaceBetween+"px",z));if(i.slidesPerColumn>1)if(e.virtualSize=(C+i.spaceBetween)*T,e.virtualSize=Math.ceil(e.virtualSize/i.slidesPerColumn)-i.spaceBetween,s.css(((P={})[t("width")]=e.virtualSize+i.spaceBetween+"px",P)),i.centeredSlides){S=[];for(var Z=0;Z<c.length;Z+=1){var J=c[Z];i.roundLengths&&(J=Math.floor(J)),c[Z]<e.virtualSize+c[0]&&S.push(J)}c=S}if(!i.centeredSlides){S=[];for(var Q=0;Q<c.length;Q+=1){var ee=c[Q];i.roundLengths&&(ee=Math.floor(ee)),c[Q]<=e.virtualSize-r&&S.push(ee)}c=S,Math.floor(e.virtualSize-r)-Math.floor(c[c.length-1])>1&&c.push(e.virtualSize-r)}if(0===c.length&&(c=[0]),0!==i.spaceBetween){var te,ae=e.isHorizontal()&&n?"marginLeft":t("marginRight");p.filter((function(e,t){return!i.cssMode||t!==p.length-1})).css(((te={})[ae]=w+"px",te))}if(i.centeredSlides&&i.centeredSlidesBounds){var ie=0;v.forEach((function(e){ie+=e+(i.spaceBetween?i.spaceBetween:0)}));var se=(ie-=i.spaceBetween)-r;c=c.map((function(e){return e<0?-f:e>se?se+m:e}))}if(i.centerInsufficientSlides){var re=0;if(v.forEach((function(e){re+=e+(i.spaceBetween?i.spaceBetween:0)})),(re-=i.spaceBetween)<r){var ne=(r-re)/2;c.forEach((function(e,t){c[t]=e-ne})),h.forEach((function(e,t){h[t]=e+ne}))}}M(e,{slides:p,snapGrid:c,slidesGrid:h,slidesSizesGrid:v}),u!==d&&e.emit("slidesLengthChange"),c.length!==g&&(e.params.watchOverflow&&e.checkOverflow(),e.emit("snapGridLengthChange")),h.length!==b&&e.emit("slidesGridLengthChange"),(i.watchSlidesProgress||i.watchSlidesVisibility)&&e.updateSlidesOffset()}},updateAutoHeight:function(e){var t,a=this,i=[],s=a.virtual&&a.params.virtual.enabled,r=0;"number"==typeof e?a.setTransition(e):!0===e&&a.setTransition(a.params.speed);var n=function(e){return s?a.slides.filter((function(t){return parseInt(t.getAttribute("data-swiper-slide-index"),10)===e}))[0]:a.slides.eq(e)[0]};if("auto"!==a.params.slidesPerView&&a.params.slidesPerView>1)if(a.params.centeredSlides)a.visibleSlides.each((function(e){i.push(e)}));else for(t=0;t<Math.ceil(a.params.slidesPerView);t+=1){var l=a.activeIndex+t;if(l>a.slides.length&&!s)break;i.push(n(l))}else i.push(n(a.activeIndex));for(t=0;t<i.length;t+=1)if(void 0!==i[t]){var o=i[t].offsetHeight;r=o>r?o:r}r&&a.$wrapperEl.css("height",r+"px")},updateSlidesOffset:function(){for(var e=this.slides,t=0;t<e.length;t+=1)e[t].swiperSlideOffset=this.isHorizontal()?e[t].offsetLeft:e[t].offsetTop},updateSlidesProgress:function(e){void 0===e&&(e=this&&this.translate||0);var t=this,a=t.params,i=t.slides,s=t.rtlTranslate;if(0!==i.length){void 0===i[0].swiperSlideOffset&&t.updateSlidesOffset();var r=-e;s&&(r=e),i.removeClass(a.slideVisibleClass),t.visibleSlidesIndexes=[],t.visibleSlides=[];for(var n=0;n<i.length;n+=1){var l=i[n],o=(r+(a.centeredSlides?t.minTranslate():0)-l.swiperSlideOffset)/(l.swiperSlideSize+a.spaceBetween);if(a.watchSlidesVisibility||a.centeredSlides&&a.autoHeight){var d=-(r-l.swiperSlideOffset),p=d+t.slidesSizesGrid[n];(d>=0&&d<t.size-1||p>1&&p<=t.size||d<=0&&p>=t.size)&&(t.visibleSlides.push(l),t.visibleSlidesIndexes.push(n),i.eq(n).addClass(a.slideVisibleClass))}l.progress=s?-o:o}t.visibleSlides=m(t.visibleSlides)}},updateProgress:function(e){var t=this;if(void 0===e){var a=t.rtlTranslate?-1:1;e=t&&t.translate&&t.translate*a||0}var i=t.params,s=t.maxTranslate()-t.minTranslate(),r=t.progress,n=t.isBeginning,l=t.isEnd,o=n,d=l;0===s?(r=0,n=!0,l=!0):(n=(r=(e-t.minTranslate())/s)<=0,l=r>=1),M(t,{progress:r,isBeginning:n,isEnd:l}),(i.watchSlidesProgress||i.watchSlidesVisibility||i.centeredSlides&&i.autoHeight)&&t.updateSlidesProgress(e),n&&!o&&t.emit("reachBeginning toEdge"),l&&!d&&t.emit("reachEnd toEdge"),(o&&!n||d&&!l)&&t.emit("fromEdge"),t.emit("progress",r)},updateSlidesClasses:function(){var e,t=this,a=t.slides,i=t.params,s=t.$wrapperEl,r=t.activeIndex,n=t.realIndex,l=t.virtual&&i.virtual.enabled;a.removeClass(i.slideActiveClass+" "+i.slideNextClass+" "+i.slidePrevClass+" "+i.slideDuplicateActiveClass+" "+i.slideDuplicateNextClass+" "+i.slideDuplicatePrevClass),(e=l?t.$wrapperEl.find("."+i.slideClass+'[data-swiper-slide-index="'+r+'"]'):a.eq(r)).addClass(i.slideActiveClass),i.loop&&(e.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+n+'"]').addClass(i.slideDuplicateActiveClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+n+'"]').addClass(i.slideDuplicateActiveClass));var o=e.nextAll("."+i.slideClass).eq(0).addClass(i.slideNextClass);i.loop&&0===o.length&&(o=a.eq(0)).addClass(i.slideNextClass);var d=e.prevAll("."+i.slideClass).eq(0).addClass(i.slidePrevClass);i.loop&&0===d.length&&(d=a.eq(-1)).addClass(i.slidePrevClass),i.loop&&(o.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+o.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicateNextClass),d.hasClass(i.slideDuplicateClass)?s.children("."+i.slideClass+":not(."+i.slideDuplicateClass+')[data-swiper-slide-index="'+d.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass):s.children("."+i.slideClass+"."+i.slideDuplicateClass+'[data-swiper-slide-index="'+d.attr("data-swiper-slide-index")+'"]').addClass(i.slideDuplicatePrevClass)),t.emitSlidesClasses()},updateActiveIndex:function(e){var t,a=this,i=a.rtlTranslate?a.translate:-a.translate,s=a.slidesGrid,r=a.snapGrid,n=a.params,l=a.activeIndex,o=a.realIndex,d=a.snapIndex,p=e;if(void 0===p){for(var u=0;u<s.length;u+=1)void 0!==s[u+1]?i>=s[u]&&i<s[u+1]-(s[u+1]-s[u])/2?p=u:i>=s[u]&&i<s[u+1]&&(p=u+1):i>=s[u]&&(p=u);n.normalizeSlideIndex&&(p<0||void 0===p)&&(p=0)}if(r.indexOf(i)>=0)t=r.indexOf(i);else{var c=Math.min(n.slidesPerGroupSkip,p);t=c+Math.floor((p-c)/n.slidesPerGroup)}if(t>=r.length&&(t=r.length-1),p!==l){var h=parseInt(a.slides.eq(p).attr("data-swiper-slide-index")||p,10);M(a,{snapIndex:t,realIndex:h,previousIndex:l,activeIndex:p}),a.emit("activeIndexChange"),a.emit("snapIndexChange"),o!==h&&a.emit("realIndexChange"),(a.initialized||a.params.runCallbacksOnInit)&&a.emit("slideChange")}else t!==d&&(a.snapIndex=t,a.emit("snapIndexChange"))},updateClickedSlide:function(e){var t,a=this,i=a.params,s=m(e.target).closest("."+i.slideClass)[0],r=!1;if(s)for(var n=0;n<a.slides.length;n+=1)if(a.slides[n]===s){r=!0,t=n;break}if(!s||!r)return a.clickedSlide=void 0,void(a.clickedIndex=void 0);a.clickedSlide=s,a.virtual&&a.params.virtual.enabled?a.clickedIndex=parseInt(m(s).attr("data-swiper-slide-index"),10):a.clickedIndex=t,i.slideToClickedSlide&&void 0!==a.clickedIndex&&a.clickedIndex!==a.activeIndex&&a.slideToClickedSlide()}},translate:{getTranslate:function(e){void 0===e&&(e=this.isHorizontal()?"x":"y");var t=this,a=t.params,i=t.rtlTranslate,s=t.translate,r=t.$wrapperEl;if(a.virtualTranslate)return i?-s:s;if(a.cssMode)return s;var n=T(r[0],e);return i&&(n=-n),n||0},setTranslate:function(e,t){var a=this,i=a.rtlTranslate,s=a.params,r=a.$wrapperEl,n=a.wrapperEl,l=a.progress,o=0,d=0;a.isHorizontal()?o=i?-e:e:d=e,s.roundLengths&&(o=Math.floor(o),d=Math.floor(d)),s.cssMode?n[a.isHorizontal()?"scrollLeft":"scrollTop"]=a.isHorizontal()?-o:-d:s.virtualTranslate||r.transform("translate3d("+o+"px, "+d+"px, 0px)"),a.previousTranslate=a.translate,a.translate=a.isHorizontal()?o:d;var p=a.maxTranslate()-a.minTranslate();(0===p?0:(e-a.minTranslate())/p)!==l&&a.updateProgress(e),a.emit("setTranslate",a.translate,t)},minTranslate:function(){return-this.snapGrid[0]},maxTranslate:function(){return-this.snapGrid[this.snapGrid.length-1]},translateTo:function(e,t,a,i,s){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===a&&(a=!0),void 0===i&&(i=!0);var r=this,n=r.params,l=r.wrapperEl;if(r.animating&&n.preventInteractionOnTransition)return!1;var o,d=r.minTranslate(),p=r.maxTranslate();if(o=i&&e>d?d:i&&e<p?p:e,r.updateProgress(o),n.cssMode){var u,c=r.isHorizontal();if(0===t)l[c?"scrollLeft":"scrollTop"]=-o;else if(l.scrollTo)l.scrollTo(((u={})[c?"left":"top"]=-o,u.behavior="smooth",u));else l[c?"scrollLeft":"scrollTop"]=-o;return!0}return 0===t?(r.setTransition(0),r.setTranslate(o),a&&(r.emit("beforeTransitionStart",t,s),r.emit("transitionEnd"))):(r.setTransition(t),r.setTranslate(o),a&&(r.emit("beforeTransitionStart",t,s),r.emit("transitionStart")),r.animating||(r.animating=!0,r.onTranslateToWrapperTransitionEnd||(r.onTranslateToWrapperTransitionEnd=function(e){r&&!r.destroyed&&e.target===this&&(r.$wrapperEl[0].removeEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.$wrapperEl[0].removeEventListener("webkitTransitionEnd",r.onTranslateToWrapperTransitionEnd),r.onTranslateToWrapperTransitionEnd=null,delete r.onTranslateToWrapperTransitionEnd,a&&r.emit("transitionEnd"))}),r.$wrapperEl[0].addEventListener("transitionend",r.onTranslateToWrapperTransitionEnd),r.$wrapperEl[0].addEventListener("webkitTransitionEnd",r.onTranslateToWrapperTransitionEnd))),!0}},transition:{setTransition:function(e,t){var a=this;a.params.cssMode||a.$wrapperEl.transition(e),a.emit("setTransition",e,t)},transitionStart:function(e,t){void 0===e&&(e=!0);var a=this,i=a.activeIndex,s=a.params,r=a.previousIndex;if(!s.cssMode){s.autoHeight&&a.updateAutoHeight();var n=t;if(n||(n=i>r?"next":i<r?"prev":"reset"),a.emit("transitionStart"),e&&i!==r){if("reset"===n)return void a.emit("slideResetTransitionStart");a.emit("slideChangeTransitionStart"),"next"===n?a.emit("slideNextTransitionStart"):a.emit("slidePrevTransitionStart")}}},transitionEnd:function(e,t){void 0===e&&(e=!0);var a=this,i=a.activeIndex,s=a.previousIndex,r=a.params;if(a.animating=!1,!r.cssMode){a.setTransition(0);var n=t;if(n||(n=i>s?"next":i<s?"prev":"reset"),a.emit("transitionEnd"),e&&i!==s){if("reset"===n)return void a.emit("slideResetTransitionEnd");a.emit("slideChangeTransitionEnd"),"next"===n?a.emit("slideNextTransitionEnd"):a.emit("slidePrevTransitionEnd")}}}},slide:{slideTo:function(e,t,a,i,s){if(void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===a&&(a=!0),"number"!=typeof e&&"string"!=typeof e)throw new Error("The 'index' argument cannot have type other than 'number' or 'string'. ["+typeof e+"] given.");if("string"==typeof e){var r=parseInt(e,10);if(!isFinite(r))throw new Error("The passed-in 'index' (string) couldn't be converted to 'number'. ["+e+"] given.");e=r}var n=this,l=e;l<0&&(l=0);var o=n.params,d=n.snapGrid,p=n.slidesGrid,u=n.previousIndex,c=n.activeIndex,h=n.rtlTranslate,v=n.wrapperEl,f=n.enabled;if(n.animating&&o.preventInteractionOnTransition||!f&&!i&&!s)return!1;var m=Math.min(n.params.slidesPerGroupSkip,l),g=m+Math.floor((l-m)/n.params.slidesPerGroup);g>=d.length&&(g=d.length-1),(c||o.initialSlide||0)===(u||0)&&a&&n.emit("beforeSlideChangeStart");var b,w=-d[g];if(n.updateProgress(w),o.normalizeSlideIndex)for(var y=0;y<p.length;y+=1){var E=-Math.floor(100*w),x=Math.floor(100*p[y]),T=Math.floor(100*p[y+1]);void 0!==p[y+1]?E>=x&&E<T-(T-x)/2?l=y:E>=x&&E<T&&(l=y+1):E>=x&&(l=y)}if(n.initialized&&l!==c){if(!n.allowSlideNext&&w<n.translate&&w<n.minTranslate())return!1;if(!n.allowSlidePrev&&w>n.translate&&w>n.maxTranslate()&&(c||0)!==l)return!1}if(b=l>c?"next":l<c?"prev":"reset",h&&-w===n.translate||!h&&w===n.translate)return n.updateActiveIndex(l),o.autoHeight&&n.updateAutoHeight(),n.updateSlidesClasses(),"slide"!==o.effect&&n.setTranslate(w),"reset"!==b&&(n.transitionStart(a,b),n.transitionEnd(a,b)),!1;if(o.cssMode){var C,S=n.isHorizontal(),M=-w;if(h&&(M=v.scrollWidth-v.offsetWidth-M),0===t)v[S?"scrollLeft":"scrollTop"]=M;else if(v.scrollTo)v.scrollTo(((C={})[S?"left":"top"]=M,C.behavior="smooth",C));else v[S?"scrollLeft":"scrollTop"]=M;return!0}return 0===t?(n.setTransition(0),n.setTranslate(w),n.updateActiveIndex(l),n.updateSlidesClasses(),n.emit("beforeTransitionStart",t,i),n.transitionStart(a,b),n.transitionEnd(a,b)):(n.setTransition(t),n.setTranslate(w),n.updateActiveIndex(l),n.updateSlidesClasses(),n.emit("beforeTransitionStart",t,i),n.transitionStart(a,b),n.animating||(n.animating=!0,n.onSlideToWrapperTransitionEnd||(n.onSlideToWrapperTransitionEnd=function(e){n&&!n.destroyed&&e.target===this&&(n.$wrapperEl[0].removeEventListener("transitionend",n.onSlideToWrapperTransitionEnd),n.$wrapperEl[0].removeEventListener("webkitTransitionEnd",n.onSlideToWrapperTransitionEnd),n.onSlideToWrapperTransitionEnd=null,delete n.onSlideToWrapperTransitionEnd,n.transitionEnd(a,b))}),n.$wrapperEl[0].addEventListener("transitionend",n.onSlideToWrapperTransitionEnd),n.$wrapperEl[0].addEventListener("webkitTransitionEnd",n.onSlideToWrapperTransitionEnd))),!0},slideToLoop:function(e,t,a,i){void 0===e&&(e=0),void 0===t&&(t=this.params.speed),void 0===a&&(a=!0);var s=this,r=e;return s.params.loop&&(r+=s.loopedSlides),s.slideTo(r,t,a,i)},slideNext:function(e,t,a){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var i=this,s=i.params,r=i.animating;if(!i.enabled)return i;var n=i.activeIndex<s.slidesPerGroupSkip?1:s.slidesPerGroup;if(s.loop){if(r&&s.loopPreventsSlide)return!1;i.loopFix(),i._clientLeft=i.$wrapperEl[0].clientLeft}return i.slideTo(i.activeIndex+n,e,t,a)},slidePrev:function(e,t,a){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0);var i=this,s=i.params,r=i.animating,n=i.snapGrid,l=i.slidesGrid,o=i.rtlTranslate;if(!i.enabled)return i;if(s.loop){if(r&&s.loopPreventsSlide)return!1;i.loopFix(),i._clientLeft=i.$wrapperEl[0].clientLeft}function d(e){return e<0?-Math.floor(Math.abs(e)):Math.floor(e)}var p,u=d(o?i.translate:-i.translate),c=n.map((function(e){return d(e)})),h=n[c.indexOf(u)-1];return void 0===h&&s.cssMode&&n.forEach((function(e){!h&&u>=e&&(h=e)})),void 0!==h&&(p=l.indexOf(h))<0&&(p=i.activeIndex-1),i.slideTo(p,e,t,a)},slideReset:function(e,t,a){return void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),this.slideTo(this.activeIndex,e,t,a)},slideToClosest:function(e,t,a,i){void 0===e&&(e=this.params.speed),void 0===t&&(t=!0),void 0===i&&(i=.5);var s=this,r=s.activeIndex,n=Math.min(s.params.slidesPerGroupSkip,r),l=n+Math.floor((r-n)/s.params.slidesPerGroup),o=s.rtlTranslate?s.translate:-s.translate;if(o>=s.snapGrid[l]){var d=s.snapGrid[l];o-d>(s.snapGrid[l+1]-d)*i&&(r+=s.params.slidesPerGroup)}else{var p=s.snapGrid[l-1];o-p<=(s.snapGrid[l]-p)*i&&(r-=s.params.slidesPerGroup)}return r=Math.max(r,0),r=Math.min(r,s.slidesGrid.length-1),s.slideTo(r,e,t,a)},slideToClickedSlide:function(){var e,t=this,a=t.params,i=t.$wrapperEl,s="auto"===a.slidesPerView?t.slidesPerViewDynamic():a.slidesPerView,r=t.clickedIndex;if(a.loop){if(t.animating)return;e=parseInt(m(t.clickedSlide).attr("data-swiper-slide-index"),10),a.centeredSlides?r<t.loopedSlides-s/2||r>t.slides.length-t.loopedSlides+s/2?(t.loopFix(),r=i.children("."+a.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+a.slideDuplicateClass+")").eq(0).index(),E((function(){t.slideTo(r)}))):t.slideTo(r):r>t.slides.length-s?(t.loopFix(),r=i.children("."+a.slideClass+'[data-swiper-slide-index="'+e+'"]:not(.'+a.slideDuplicateClass+")").eq(0).index(),E((function(){t.slideTo(r)}))):t.slideTo(r)}else t.slideTo(r)}},loop:{loopCreate:function(){var e=this,t=r(),a=e.params,i=e.$wrapperEl;i.children("."+a.slideClass+"."+a.slideDuplicateClass).remove();var s=i.children("."+a.slideClass);if(a.loopFillGroupWithBlank){var n=a.slidesPerGroup-s.length%a.slidesPerGroup;if(n!==a.slidesPerGroup){for(var l=0;l<n;l+=1){var o=m(t.createElement("div")).addClass(a.slideClass+" "+a.slideBlankClass);i.append(o)}s=i.children("."+a.slideClass)}}"auto"!==a.slidesPerView||a.loopedSlides||(a.loopedSlides=s.length),e.loopedSlides=Math.ceil(parseFloat(a.loopedSlides||a.slidesPerView,10)),e.loopedSlides+=a.loopAdditionalSlides,e.loopedSlides>s.length&&(e.loopedSlides=s.length);var d=[],p=[];s.each((function(t,a){var i=m(t);a<e.loopedSlides&&p.push(t),a<s.length&&a>=s.length-e.loopedSlides&&d.push(t),i.attr("data-swiper-slide-index",a)}));for(var u=0;u<p.length;u+=1)i.append(m(p[u].cloneNode(!0)).addClass(a.slideDuplicateClass));for(var c=d.length-1;c>=0;c-=1)i.prepend(m(d[c].cloneNode(!0)).addClass(a.slideDuplicateClass))},loopFix:function(){var e=this;e.emit("beforeLoopFix");var t,a=e.activeIndex,i=e.slides,s=e.loopedSlides,r=e.allowSlidePrev,n=e.allowSlideNext,l=e.snapGrid,o=e.rtlTranslate;e.allowSlidePrev=!0,e.allowSlideNext=!0;var d=-l[a]-e.getTranslate();if(a<s)t=i.length-3*s+a,t+=s,e.slideTo(t,0,!1,!0)&&0!==d&&e.setTranslate((o?-e.translate:e.translate)-d);else if(a>=i.length-s){t=-i.length+a+s,t+=s,e.slideTo(t,0,!1,!0)&&0!==d&&e.setTranslate((o?-e.translate:e.translate)-d)}e.allowSlidePrev=r,e.allowSlideNext=n,e.emit("loopFix")},loopDestroy:function(){var e=this,t=e.$wrapperEl,a=e.params,i=e.slides;t.children("."+a.slideClass+"."+a.slideDuplicateClass+",."+a.slideClass+"."+a.slideBlankClass).remove(),i.removeAttr("data-swiper-slide-index")}},grabCursor:{setGrabCursor:function(e){var t=this;if(!(t.support.touch||!t.params.simulateTouch||t.params.watchOverflow&&t.isLocked||t.params.cssMode)){var a=t.el;a.style.cursor="move",a.style.cursor=e?"-webkit-grabbing":"-webkit-grab",a.style.cursor=e?"-moz-grabbin":"-moz-grab",a.style.cursor=e?"grabbing":"grab"}},unsetGrabCursor:function(){var e=this;e.support.touch||e.params.watchOverflow&&e.isLocked||e.params.cssMode||(e.el.style.cursor="")}},manipulation:{appendSlide:function(e){var t=this,a=t.$wrapperEl,i=t.params;if(i.loop&&t.loopDestroy(),"object"==typeof e&&"length"in e)for(var s=0;s<e.length;s+=1)e[s]&&a.append(e[s]);else a.append(e);i.loop&&t.loopCreate(),i.observer&&t.support.observer||t.update()},prependSlide:function(e){var t=this,a=t.params,i=t.$wrapperEl,s=t.activeIndex;a.loop&&t.loopDestroy();var r=s+1;if("object"==typeof e&&"length"in e){for(var n=0;n<e.length;n+=1)e[n]&&i.prepend(e[n]);r=s+e.length}else i.prepend(e);a.loop&&t.loopCreate(),a.observer&&t.support.observer||t.update(),t.slideTo(r,0,!1)},addSlide:function(e,t){var a=this,i=a.$wrapperEl,s=a.params,r=a.activeIndex;s.loop&&(r-=a.loopedSlides,a.loopDestroy(),a.slides=i.children("."+s.slideClass));var n=a.slides.length;if(e<=0)a.prependSlide(t);else if(e>=n)a.appendSlide(t);else{for(var l=r>e?r+1:r,o=[],d=n-1;d>=e;d-=1){var p=a.slides.eq(d);p.remove(),o.unshift(p)}if("object"==typeof t&&"length"in t){for(var u=0;u<t.length;u+=1)t[u]&&i.append(t[u]);l=r>e?r+t.length:r}else i.append(t);for(var c=0;c<o.length;c+=1)i.append(o[c]);s.loop&&a.loopCreate(),s.observer&&a.support.observer||a.update(),s.loop?a.slideTo(l+a.loopedSlides,0,!1):a.slideTo(l,0,!1)}},removeSlide:function(e){var t=this,a=t.params,i=t.$wrapperEl,s=t.activeIndex;a.loop&&(s-=t.loopedSlides,t.loopDestroy(),t.slides=i.children("."+a.slideClass));var r,n=s;if("object"==typeof e&&"length"in e){for(var l=0;l<e.length;l+=1)r=e[l],t.slides[r]&&t.slides.eq(r).remove(),r<n&&(n-=1);n=Math.max(n,0)}else r=e,t.slides[r]&&t.slides.eq(r).remove(),r<n&&(n-=1),n=Math.max(n,0);a.loop&&t.loopCreate(),a.observer&&t.support.observer||t.update(),a.loop?t.slideTo(n+t.loopedSlides,0,!1):t.slideTo(n,0,!1)},removeAllSlides:function(){for(var e=[],t=0;t<this.slides.length;t+=1)e.push(t);this.removeSlide(e)}},events:{attachEvents:function(){var e=this,t=r(),a=e.params,i=e.touchEvents,s=e.el,n=e.wrapperEl,l=e.device,o=e.support;e.onTouchStart=N.bind(e),e.onTouchMove=G.bind(e),e.onTouchEnd=B.bind(e),a.cssMode&&(e.onScroll=X.bind(e)),e.onClick=R.bind(e);var d=!!a.nested;if(!o.touch&&o.pointerEvents)s.addEventListener(i.start,e.onTouchStart,!1),t.addEventListener(i.move,e.onTouchMove,d),t.addEventListener(i.end,e.onTouchEnd,!1);else{if(o.touch){var p=!("touchstart"!==i.start||!o.passiveListener||!a.passiveListeners)&&{passive:!0,capture:!1};s.addEventListener(i.start,e.onTouchStart,p),s.addEventListener(i.move,e.onTouchMove,o.passiveListener?{passive:!1,capture:d}:d),s.addEventListener(i.end,e.onTouchEnd,p),i.cancel&&s.addEventListener(i.cancel,e.onTouchEnd,p),Y||(t.addEventListener("touchstart",V),Y=!0)}(a.simulateTouch&&!l.ios&&!l.android||a.simulateTouch&&!o.touch&&l.ios)&&(s.addEventListener("mousedown",e.onTouchStart,!1),t.addEventListener("mousemove",e.onTouchMove,d),t.addEventListener("mouseup",e.onTouchEnd,!1))}(a.preventClicks||a.preventClicksPropagation)&&s.addEventListener("click",e.onClick,!0),a.cssMode&&n.addEventListener("scroll",e.onScroll),a.updateOnWindowResize?e.on(l.ios||l.android?"resize orientationchange observerUpdate":"resize observerUpdate",H,!0):e.on("observerUpdate",H,!0)},detachEvents:function(){var e=this,t=r(),a=e.params,i=e.touchEvents,s=e.el,n=e.wrapperEl,l=e.device,o=e.support,d=!!a.nested;if(!o.touch&&o.pointerEvents)s.removeEventListener(i.start,e.onTouchStart,!1),t.removeEventListener(i.move,e.onTouchMove,d),t.removeEventListener(i.end,e.onTouchEnd,!1);else{if(o.touch){var p=!("onTouchStart"!==i.start||!o.passiveListener||!a.passiveListeners)&&{passive:!0,capture:!1};s.removeEventListener(i.start,e.onTouchStart,p),s.removeEventListener(i.move,e.onTouchMove,d),s.removeEventListener(i.end,e.onTouchEnd,p),i.cancel&&s.removeEventListener(i.cancel,e.onTouchEnd,p)}(a.simulateTouch&&!l.ios&&!l.android||a.simulateTouch&&!o.touch&&l.ios)&&(s.removeEventListener("mousedown",e.onTouchStart,!1),t.removeEventListener("mousemove",e.onTouchMove,d),t.removeEventListener("mouseup",e.onTouchEnd,!1))}(a.preventClicks||a.preventClicksPropagation)&&s.removeEventListener("click",e.onClick,!0),a.cssMode&&n.removeEventListener("scroll",e.onScroll),e.off(l.ios||l.android?"resize orientationchange observerUpdate":"resize observerUpdate",H)}},breakpoints:{setBreakpoint:function(){var e=this,t=e.activeIndex,a=e.initialized,i=e.loopedSlides,s=void 0===i?0:i,r=e.params,n=e.$el,l=r.breakpoints;if(l&&(!l||0!==Object.keys(l).length)){var o=e.getBreakpoint(l,e.params.breakpointsBase,e.el);if(o&&e.currentBreakpoint!==o){var d=o in l?l[o]:void 0;d&&["slidesPerView","spaceBetween","slidesPerGroup","slidesPerGroupSkip","slidesPerColumn"].forEach((function(e){var t=d[e];void 0!==t&&(d[e]="slidesPerView"!==e||"AUTO"!==t&&"auto"!==t?"slidesPerView"===e?parseFloat(t):parseInt(t,10):"auto")}));var p=d||e.originalParams,u=r.slidesPerColumn>1,c=p.slidesPerColumn>1,h=r.enabled;u&&!c?(n.removeClass(r.containerModifierClass+"multirow "+r.containerModifierClass+"multirow-column"),e.emitContainerClasses()):!u&&c&&(n.addClass(r.containerModifierClass+"multirow"),(p.slidesPerColumnFill&&"column"===p.slidesPerColumnFill||!p.slidesPerColumnFill&&"column"===r.slidesPerColumnFill)&&n.addClass(r.containerModifierClass+"multirow-column"),e.emitContainerClasses());var v=p.direction&&p.direction!==r.direction,f=r.loop&&(p.slidesPerView!==r.slidesPerView||v);v&&a&&e.changeDirection(),M(e.params,p);var m=e.params.enabled;M(e,{allowTouchMove:e.params.allowTouchMove,allowSlideNext:e.params.allowSlideNext,allowSlidePrev:e.params.allowSlidePrev}),h&&!m?e.disable():!h&&m&&e.enable(),e.currentBreakpoint=o,e.emit("_beforeBreakpoint",p),f&&a&&(e.loopDestroy(),e.loopCreate(),e.updateSlides(),e.slideTo(t-s+e.loopedSlides,0,!1)),e.emit("breakpoint",p)}}},getBreakpoint:function(e,t,a){if(void 0===t&&(t="window"),e&&("container"!==t||a)){var i=!1,s=l(),r="window"===t?s.innerHeight:a.clientHeight,n=Object.keys(e).map((function(e){if("string"==typeof e&&0===e.indexOf("@")){var t=parseFloat(e.substr(1));return{value:r*t,point:e}}return{value:e,point:e}}));n.sort((function(e,t){return parseInt(e.value,10)-parseInt(t.value,10)}));for(var o=0;o<n.length;o+=1){var d=n[o],p=d.point,u=d.value;"window"===t?s.matchMedia("(min-width: "+u+"px)").matches&&(i=p):u<=a.clientWidth&&(i=p)}return i||"max"}}},checkOverflow:{checkOverflow:function(){var e=this,t=e.params,a=e.isLocked,i=e.slides.length>0&&t.slidesOffsetBefore+t.spaceBetween*(e.slides.length-1)+e.slides[0].offsetWidth*e.slides.length;t.slidesOffsetBefore&&t.slidesOffsetAfter&&i?e.isLocked=i<=e.size:e.isLocked=1===e.snapGrid.length,e.allowSlideNext=!e.isLocked,e.allowSlidePrev=!e.isLocked,a!==e.isLocked&&e.emit(e.isLocked?"lock":"unlock"),a&&a!==e.isLocked&&(e.isEnd=!1,e.navigation&&e.navigation.update())}},classes:{addClasses:function(){var e,t,a,i=this,s=i.classNames,r=i.params,n=i.rtl,l=i.$el,o=i.device,d=i.support,p=(e=["initialized",r.direction,{"pointer-events":d.pointerEvents&&!d.touch},{"free-mode":r.freeMode},{autoheight:r.autoHeight},{rtl:n},{multirow:r.slidesPerColumn>1},{"multirow-column":r.slidesPerColumn>1&&"column"===r.slidesPerColumnFill},{android:o.android},{ios:o.ios},{"css-mode":r.cssMode}],t=r.containerModifierClass,a=[],e.forEach((function(e){"object"==typeof e?Object.keys(e).forEach((function(i){e[i]&&a.push(t+i)})):"string"==typeof e&&a.push(t+e)})),a);s.push.apply(s,p),l.addClass([].concat(s).join(" ")),i.emitContainerClasses()},removeClasses:function(){var e=this,t=e.$el,a=e.classNames;t.removeClass(a.join(" ")),e.emitContainerClasses()}},images:{loadImage:function(e,t,a,i,s,r){var n,o=l();function d(){r&&r()}m(e).parent("picture")[0]||e.complete&&s?d():t?((n=new o.Image).onload=d,n.onerror=d,i&&(n.sizes=i),a&&(n.srcset=a),t&&(n.src=t)):d()},preloadImages:function(){var e=this;function t(){null!=e&&e&&!e.destroyed&&(void 0!==e.imagesLoaded&&(e.imagesLoaded+=1),e.imagesLoaded===e.imagesToLoad.length&&(e.params.updateOnImagesReady&&e.update(),e.emit("imagesReady")))}e.imagesToLoad=e.$el.find("img");for(var a=0;a<e.imagesToLoad.length;a+=1){var i=e.imagesToLoad[a];e.loadImage(i,i.currentSrc||i.getAttribute("src"),i.srcset||i.getAttribute("srcset"),i.sizes||i.getAttribute("sizes"),!0,t)}}}},_={},q=function(){function t(){for(var e,a,i=arguments.length,s=new Array(i),r=0;r<i;r++)s[r]=arguments[r];if(1===s.length&&s[0].constructor&&"Object"===Object.prototype.toString.call(s[0]).slice(8,-1)?a=s[0]:(e=s[0],a=s[1]),a||(a={}),a=M({},a),e&&!a.el&&(a.el=e),a.el&&m(a.el).length>1){var n=[];return m(a.el).each((function(e){var i=M({},a,{el:e});n.push(new t(i))})),n}var l=this;l.__swiper__=!0,l.support=$(),l.device=L({userAgent:a.userAgent}),l.browser=I(),l.eventsListeners={},l.eventsAnyListeners=[],void 0===l.modules&&(l.modules={}),Object.keys(l.modules).forEach((function(e){var t=l.modules[e];if(t.params){var i=Object.keys(t.params)[0],s=t.params[i];if("object"!=typeof s||null===s)return;if(["navigation","pagination","scrollbar"].indexOf(i)>=0&&!0===a[i]&&(a[i]={auto:!0}),!(i in a)||!("enabled"in s))return;!0===a[i]&&(a[i]={enabled:!0}),"object"!=typeof a[i]||"enabled"in a[i]||(a[i].enabled=!0),a[i]||(a[i]={enabled:!1})}}));var o,d,p=M({},W);return l.useParams(p),l.params=M({},p,_,a),l.originalParams=M({},l.params),l.passedParams=M({},a),l.params&&l.params.on&&Object.keys(l.params.on).forEach((function(e){l.on(e,l.params.on[e])})),l.params&&l.params.onAny&&l.onAny(l.params.onAny),l.$=m,M(l,{enabled:l.params.enabled,el:e,classNames:[],slides:m(),slidesGrid:[],snapGrid:[],slidesSizesGrid:[],isHorizontal:function(){return"horizontal"===l.params.direction},isVertical:function(){return"vertical"===l.params.direction},activeIndex:0,realIndex:0,isBeginning:!0,isEnd:!1,translate:0,previousTranslate:0,progress:0,velocity:0,animating:!1,allowSlideNext:l.params.allowSlideNext,allowSlidePrev:l.params.allowSlidePrev,touchEvents:(o=["touchstart","touchmove","touchend","touchcancel"],d=["mousedown","mousemove","mouseup"],l.support.pointerEvents&&(d=["pointerdown","pointermove","pointerup"]),l.touchEventsTouch={start:o[0],move:o[1],end:o[2],cancel:o[3]},l.touchEventsDesktop={start:d[0],move:d[1],end:d[2]},l.support.touch||!l.params.simulateTouch?l.touchEventsTouch:l.touchEventsDesktop),touchEventsData:{isTouched:void 0,isMoved:void 0,allowTouchCallbacks:void 0,touchStartTime:void 0,isScrolling:void 0,currentTranslate:void 0,startTranslate:void 0,allowThresholdMove:void 0,focusableElements:l.params.focusableElements,lastClickTime:x(),clickTimeout:void 0,velocities:[],allowMomentumBounce:void 0,isTouchEvent:void 0,startMoving:void 0},allowClick:!0,allowTouchMove:l.params.allowTouchMove,touches:{startX:0,startY:0,currentX:0,currentY:0,diff:0},imagesToLoad:[],imagesLoaded:0}),l.useModules(),l.emit("_swiper"),l.params.init&&l.init(),l}var a,i,s,n=t.prototype;return n.enable=function(){var e=this;e.enabled||(e.enabled=!0,e.params.grabCursor&&e.setGrabCursor(),e.emit("enable"))},n.disable=function(){var e=this;e.enabled&&(e.enabled=!1,e.params.grabCursor&&e.unsetGrabCursor(),e.emit("disable"))},n.setProgress=function(e,t){var a=this;e=Math.min(Math.max(e,0),1);var i=a.minTranslate(),s=(a.maxTranslate()-i)*e+i;a.translateTo(s,void 0===t?0:t),a.updateActiveIndex(),a.updateSlidesClasses()},n.emitContainerClasses=function(){var e=this;if(e.params._emitClasses&&e.el){var t=e.el.className.split(" ").filter((function(t){return 0===t.indexOf("swiper-container")||0===t.indexOf(e.params.containerModifierClass)}));e.emit("_containerClasses",t.join(" "))}},n.getSlideClasses=function(e){var t=this;return e.className.split(" ").filter((function(e){return 0===e.indexOf("swiper-slide")||0===e.indexOf(t.params.slideClass)})).join(" ")},n.emitSlidesClasses=function(){var e=this;if(e.params._emitClasses&&e.el){var t=[];e.slides.each((function(a){var i=e.getSlideClasses(a);t.push({slideEl:a,classNames:i}),e.emit("_slideClass",a,i)})),e.emit("_slideClasses",t)}},n.slidesPerViewDynamic=function(){var e=this,t=e.params,a=e.slides,i=e.slidesGrid,s=e.size,r=e.activeIndex,n=1;if(t.centeredSlides){for(var l,o=a[r].swiperSlideSize,d=r+1;d<a.length;d+=1)a[d]&&!l&&(n+=1,(o+=a[d].swiperSlideSize)>s&&(l=!0));for(var p=r-1;p>=0;p-=1)a[p]&&!l&&(n+=1,(o+=a[p].swiperSlideSize)>s&&(l=!0))}else for(var u=r+1;u<a.length;u+=1)i[u]-i[r]<s&&(n+=1);return n},n.update=function(){var e=this;if(e&&!e.destroyed){var t=e.snapGrid,a=e.params;a.breakpoints&&e.setBreakpoint(),e.updateSize(),e.updateSlides(),e.updateProgress(),e.updateSlidesClasses(),e.params.freeMode?(i(),e.params.autoHeight&&e.updateAutoHeight()):(("auto"===e.params.slidesPerView||e.params.slidesPerView>1)&&e.isEnd&&!e.params.centeredSlides?e.slideTo(e.slides.length-1,0,!1,!0):e.slideTo(e.activeIndex,0,!1,!0))||i(),a.watchOverflow&&t!==e.snapGrid&&e.checkOverflow(),e.emit("update")}function i(){var t=e.rtlTranslate?-1*e.translate:e.translate,a=Math.min(Math.max(t,e.maxTranslate()),e.minTranslate());e.setTranslate(a),e.updateActiveIndex(),e.updateSlidesClasses()}},n.changeDirection=function(e,t){void 0===t&&(t=!0);var a=this,i=a.params.direction;return e||(e="horizontal"===i?"vertical":"horizontal"),e===i||"horizontal"!==e&&"vertical"!==e||(a.$el.removeClass(""+a.params.containerModifierClass+i).addClass(""+a.params.containerModifierClass+e),a.emitContainerClasses(),a.params.direction=e,a.slides.each((function(t){"vertical"===e?t.style.width="":t.style.height=""})),a.emit("changeDirection"),t&&a.update()),a},n.mount=function(e){var t=this;if(t.mounted)return!0;var a=m(e||t.params.el);if(!(e=a[0]))return!1;e.swiper=t;var i=function(){return"."+(t.params.wrapperClass||"").trim().split(" ").join(".")},s=function(){if(e&&e.shadowRoot&&e.shadowRoot.querySelector){var t=m(e.shadowRoot.querySelector(i()));return t.children=function(e){return a.children(e)},t}return a.children(i())}();if(0===s.length&&t.params.createElements){var n=r().createElement("div");s=m(n),n.className=t.params.wrapperClass,a.append(n),a.children("."+t.params.slideClass).each((function(e){s.append(e)}))}return M(t,{$el:a,el:e,$wrapperEl:s,wrapperEl:s[0],mounted:!0,rtl:"rtl"===e.dir.toLowerCase()||"rtl"===a.css("direction"),rtlTranslate:"horizontal"===t.params.direction&&("rtl"===e.dir.toLowerCase()||"rtl"===a.css("direction")),wrongRTL:"-webkit-box"===s.css("display")}),!0},n.init=function(e){var t=this;return t.initialized||!1===t.mount(e)||(t.emit("beforeInit"),t.params.breakpoints&&t.setBreakpoint(),t.addClasses(),t.params.loop&&t.loopCreate(),t.updateSize(),t.updateSlides(),t.params.watchOverflow&&t.checkOverflow(),t.params.grabCursor&&t.enabled&&t.setGrabCursor(),t.params.preloadImages&&t.preloadImages(),t.params.loop?t.slideTo(t.params.initialSlide+t.loopedSlides,0,t.params.runCallbacksOnInit,!1,!0):t.slideTo(t.params.initialSlide,0,t.params.runCallbacksOnInit,!1,!0),t.attachEvents(),t.initialized=!0,t.emit("init"),t.emit("afterInit")),t},n.destroy=function(e,t){void 0===e&&(e=!0),void 0===t&&(t=!0);var a,i=this,s=i.params,r=i.$el,n=i.$wrapperEl,l=i.slides;return void 0===i.params||i.destroyed||(i.emit("beforeDestroy"),i.initialized=!1,i.detachEvents(),s.loop&&i.loopDestroy(),t&&(i.removeClasses(),r.removeAttr("style"),n.removeAttr("style"),l&&l.length&&l.removeClass([s.slideVisibleClass,s.slideActiveClass,s.slideNextClass,s.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index")),i.emit("destroy"),Object.keys(i.eventsListeners).forEach((function(e){i.off(e)})),!1!==e&&(i.$el[0].swiper=null,a=i,Object.keys(a).forEach((function(e){try{a[e]=null}catch(e){}try{delete a[e]}catch(e){}}))),i.destroyed=!0),null},t.extendDefaults=function(e){M(_,e)},t.installModule=function(e){t.prototype.modules||(t.prototype.modules={});var a=e.name||Object.keys(t.prototype.modules).length+"_"+x();t.prototype.modules[a]=e},t.use=function(e){return Array.isArray(e)?(e.forEach((function(e){return t.installModule(e)})),t):(t.installModule(e),t)},a=t,s=[{key:"extendedDefaults",get:function(){return _}},{key:"defaults",get:function(){return W}}],(i=null)&&e(a.prototype,i),s&&e(a,s),t}();Object.keys(F).forEach((function(e){Object.keys(F[e]).forEach((function(t){q.prototype[t]=F[e][t]}))})),q.use([O,D]);var j={update:function(e){var t=this,a=t.params,i=a.slidesPerView,s=a.slidesPerGroup,r=a.centeredSlides,n=t.params.virtual,l=n.addSlidesBefore,o=n.addSlidesAfter,d=t.virtual,p=d.from,u=d.to,c=d.slides,h=d.slidesGrid,v=d.renderSlide,f=d.offset;t.updateActiveIndex();var m,g,b,w=t.activeIndex||0;m=t.rtlTranslate?"right":t.isHorizontal()?"left":"top",r?(g=Math.floor(i/2)+s+o,b=Math.floor(i/2)+s+l):(g=i+(s-1)+o,b=s+l);var y=Math.max((w||0)-b,0),E=Math.min((w||0)+g,c.length-1),x=(t.slidesGrid[y]||0)-(t.slidesGrid[0]||0);function T(){t.updateSlides(),t.updateProgress(),t.updateSlidesClasses(),t.lazy&&t.params.lazy.enabled&&t.lazy.load()}if(M(t.virtual,{from:y,to:E,offset:x,slidesGrid:t.slidesGrid}),p===y&&u===E&&!e)return t.slidesGrid!==h&&x!==f&&t.slides.css(m,x+"px"),void t.updateProgress();if(t.params.virtual.renderExternal)return t.params.virtual.renderExternal.call(t,{offset:x,from:y,to:E,slides:function(){for(var e=[],t=y;t<=E;t+=1)e.push(c[t]);return e}()}),void(t.params.virtual.renderExternalUpdate&&T());var C=[],S=[];if(e)t.$wrapperEl.find("."+t.params.slideClass).remove();else for(var z=p;z<=u;z+=1)(z<y||z>E)&&t.$wrapperEl.find("."+t.params.slideClass+'[data-swiper-slide-index="'+z+'"]').remove();for(var P=0;P<c.length;P+=1)P>=y&&P<=E&&(void 0===u||e?S.push(P):(P>u&&S.push(P),P<p&&C.push(P)));S.forEach((function(e){t.$wrapperEl.append(v(c[e],e))})),C.sort((function(e,t){return t-e})).forEach((function(e){t.$wrapperEl.prepend(v(c[e],e))})),t.$wrapperEl.children(".swiper-slide").css(m,x+"px"),T()},renderSlide:function(e,t){var a=this,i=a.params.virtual;if(i.cache&&a.virtual.cache[t])return a.virtual.cache[t];var s=i.renderSlide?m(i.renderSlide.call(a,e,t)):m('<div class="'+a.params.slideClass+'" data-swiper-slide-index="'+t+'">'+e+"</div>");return s.attr("data-swiper-slide-index")||s.attr("data-swiper-slide-index",t),i.cache&&(a.virtual.cache[t]=s),s},appendSlide:function(e){var t=this;if("object"==typeof e&&"length"in e)for(var a=0;a<e.length;a+=1)e[a]&&t.virtual.slides.push(e[a]);else t.virtual.slides.push(e);t.virtual.update(!0)},prependSlide:function(e){var t=this,a=t.activeIndex,i=a+1,s=1;if(Array.isArray(e)){for(var r=0;r<e.length;r+=1)e[r]&&t.virtual.slides.unshift(e[r]);i=a+e.length,s=e.length}else t.virtual.slides.unshift(e);if(t.params.virtual.cache){var n=t.virtual.cache,l={};Object.keys(n).forEach((function(e){var t=n[e],a=t.attr("data-swiper-slide-index");a&&t.attr("data-swiper-slide-index",parseInt(a,10)+1),l[parseInt(e,10)+s]=t})),t.virtual.cache=l}t.virtual.update(!0),t.slideTo(i,0)},removeSlide:function(e){var t=this;if(null!=e){var a=t.activeIndex;if(Array.isArray(e))for(var i=e.length-1;i>=0;i-=1)t.virtual.slides.splice(e[i],1),t.params.virtual.cache&&delete t.virtual.cache[e[i]],e[i]<a&&(a-=1),a=Math.max(a,0);else t.virtual.slides.splice(e,1),t.params.virtual.cache&&delete t.virtual.cache[e],e<a&&(a-=1),a=Math.max(a,0);t.virtual.update(!0),t.slideTo(a,0)}},removeAllSlides:function(){var e=this;e.virtual.slides=[],e.params.virtual.cache&&(e.virtual.cache={}),e.virtual.update(!0),e.slideTo(0,0)}},U={name:"virtual",params:{virtual:{enabled:!1,slides:[],cache:!0,renderSlide:null,renderExternal:null,renderExternalUpdate:!0,addSlidesBefore:0,addSlidesAfter:0}},create:function(){z(this,{virtual:t({},j,{slides:this.params.virtual.slides,cache:{}})})},on:{beforeInit:function(e){if(e.params.virtual.enabled){e.classNames.push(e.params.containerModifierClass+"virtual");var t={watchSlidesProgress:!0};M(e.params,t),M(e.originalParams,t),e.params.initialSlide||e.virtual.update()}},setTranslate:function(e){e.params.virtual.enabled&&e.virtual.update()}}},K={handle:function(e){var t=this;if(t.enabled){var a=l(),i=r(),s=t.rtlTranslate,n=e;n.originalEvent&&(n=n.originalEvent);var o=n.keyCode||n.charCode,d=t.params.keyboard.pageUpDown,p=d&&33===o,u=d&&34===o,c=37===o,h=39===o,v=38===o,f=40===o;if(!t.allowSlideNext&&(t.isHorizontal()&&h||t.isVertical()&&f||u))return!1;if(!t.allowSlidePrev&&(t.isHorizontal()&&c||t.isVertical()&&v||p))return!1;if(!(n.shiftKey||n.altKey||n.ctrlKey||n.metaKey||i.activeElement&&i.activeElement.nodeName&&("input"===i.activeElement.nodeName.toLowerCase()||"textarea"===i.activeElement.nodeName.toLowerCase()))){if(t.params.keyboard.onlyInViewport&&(p||u||c||h||v||f)){var m=!1;if(t.$el.parents("."+t.params.slideClass).length>0&&0===t.$el.parents("."+t.params.slideActiveClass).length)return;var g=t.$el,b=g[0].clientWidth,w=g[0].clientHeight,y=a.innerWidth,E=a.innerHeight,x=t.$el.offset();s&&(x.left-=t.$el[0].scrollLeft);for(var T=[[x.left,x.top],[x.left+b,x.top],[x.left,x.top+w],[x.left+b,x.top+w]],C=0;C<T.length;C+=1){var S=T[C];if(S[0]>=0&&S[0]<=y&&S[1]>=0&&S[1]<=E){if(0===S[0]&&0===S[1])continue;m=!0}}if(!m)return}t.isHorizontal()?((p||u||c||h)&&(n.preventDefault?n.preventDefault():n.returnValue=!1),((u||h)&&!s||(p||c)&&s)&&t.slideNext(),((p||c)&&!s||(u||h)&&s)&&t.slidePrev()):((p||u||v||f)&&(n.preventDefault?n.preventDefault():n.returnValue=!1),(u||f)&&t.slideNext(),(p||v)&&t.slidePrev()),t.emit("keyPress",o)}}},enable:function(){var e=this,t=r();e.keyboard.enabled||(m(t).on("keydown",e.keyboard.handle),e.keyboard.enabled=!0)},disable:function(){var e=this,t=r();e.keyboard.enabled&&(m(t).off("keydown",e.keyboard.handle),e.keyboard.enabled=!1)}},Z={name:"keyboard",params:{keyboard:{enabled:!1,onlyInViewport:!0,pageUpDown:!0}},create:function(){z(this,{keyboard:t({enabled:!1},K)})},on:{init:function(e){e.params.keyboard.enabled&&e.keyboard.enable()},destroy:function(e){e.keyboard.enabled&&e.keyboard.disable()}}};var J={lastScrollTime:x(),lastEventBeforeSnap:void 0,recentWheelEvents:[],event:function(){return l().navigator.userAgent.indexOf("firefox")>-1?"DOMMouseScroll":function(){var e=r(),t="onwheel",a=t in e;if(!a){var i=e.createElement("div");i.setAttribute(t,"return;"),a="function"==typeof i.onwheel}return!a&&e.implementation&&e.implementation.hasFeature&&!0!==e.implementation.hasFeature("","")&&(a=e.implementation.hasFeature("Events.wheel","3.0")),a}()?"wheel":"mousewheel"},normalize:function(e){var t=0,a=0,i=0,s=0;return"detail"in e&&(a=e.detail),"wheelDelta"in e&&(a=-e.wheelDelta/120),"wheelDeltaY"in e&&(a=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(t=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(t=a,a=0),i=10*t,s=10*a,"deltaY"in e&&(s=e.deltaY),"deltaX"in e&&(i=e.deltaX),e.shiftKey&&!i&&(i=s,s=0),(i||s)&&e.deltaMode&&(1===e.deltaMode?(i*=40,s*=40):(i*=800,s*=800)),i&&!t&&(t=i<1?-1:1),s&&!a&&(a=s<1?-1:1),{spinX:t,spinY:a,pixelX:i,pixelY:s}},handleMouseEnter:function(){this.enabled&&(this.mouseEntered=!0)},handleMouseLeave:function(){this.enabled&&(this.mouseEntered=!1)},handle:function(e){var t=e,a=this;if(a.enabled){var i=a.params.mousewheel;a.params.cssMode&&t.preventDefault();var s=a.$el;if("container"!==a.params.mousewheel.eventsTarget&&(s=m(a.params.mousewheel.eventsTarget)),!a.mouseEntered&&!s[0].contains(t.target)&&!i.releaseOnEdges)return!0;t.originalEvent&&(t=t.originalEvent);var r=0,n=a.rtlTranslate?-1:1,l=J.normalize(t);if(i.forceToAxis)if(a.isHorizontal()){if(!(Math.abs(l.pixelX)>Math.abs(l.pixelY)))return!0;r=-l.pixelX*n}else{if(!(Math.abs(l.pixelY)>Math.abs(l.pixelX)))return!0;r=-l.pixelY}else r=Math.abs(l.pixelX)>Math.abs(l.pixelY)?-l.pixelX*n:-l.pixelY;if(0===r)return!0;i.invert&&(r=-r);var o=a.getTranslate()+r*i.sensitivity;if(o>=a.minTranslate()&&(o=a.minTranslate()),o<=a.maxTranslate()&&(o=a.maxTranslate()),(!!a.params.loop||!(o===a.minTranslate()||o===a.maxTranslate()))&&a.params.nested&&t.stopPropagation(),a.params.freeMode){var d={time:x(),delta:Math.abs(r),direction:Math.sign(r)},p=a.mousewheel.lastEventBeforeSnap,u=p&&d.time<p.time+500&&d.delta<=p.delta&&d.direction===p.direction;if(!u){a.mousewheel.lastEventBeforeSnap=void 0,a.params.loop&&a.loopFix();var c=a.getTranslate()+r*i.sensitivity,h=a.isBeginning,v=a.isEnd;if(c>=a.minTranslate()&&(c=a.minTranslate()),c<=a.maxTranslate()&&(c=a.maxTranslate()),a.setTransition(0),a.setTranslate(c),a.updateProgress(),a.updateActiveIndex(),a.updateSlidesClasses(),(!h&&a.isBeginning||!v&&a.isEnd)&&a.updateSlidesClasses(),a.params.freeModeSticky){clearTimeout(a.mousewheel.timeout),a.mousewheel.timeout=void 0;var f=a.mousewheel.recentWheelEvents;f.length>=15&&f.shift();var g=f.length?f[f.length-1]:void 0,b=f[0];if(f.push(d),g&&(d.delta>g.delta||d.direction!==g.direction))f.splice(0);else if(f.length>=15&&d.time-b.time<500&&b.delta-d.delta>=1&&d.delta<=6){var w=r>0?.8:.2;a.mousewheel.lastEventBeforeSnap=d,f.splice(0),a.mousewheel.timeout=E((function(){a.slideToClosest(a.params.speed,!0,void 0,w)}),0)}a.mousewheel.timeout||(a.mousewheel.timeout=E((function(){a.mousewheel.lastEventBeforeSnap=d,f.splice(0),a.slideToClosest(a.params.speed,!0,void 0,.5)}),500))}if(u||a.emit("scroll",t),a.params.autoplay&&a.params.autoplayDisableOnInteraction&&a.autoplay.stop(),c===a.minTranslate()||c===a.maxTranslate())return!0}}else{var y={time:x(),delta:Math.abs(r),direction:Math.sign(r),raw:e},T=a.mousewheel.recentWheelEvents;T.length>=2&&T.shift();var C=T.length?T[T.length-1]:void 0;if(T.push(y),C?(y.direction!==C.direction||y.delta>C.delta||y.time>C.time+150)&&a.mousewheel.animateSlider(y):a.mousewheel.animateSlider(y),a.mousewheel.releaseScroll(y))return!0}return t.preventDefault?t.preventDefault():t.returnValue=!1,!1}},animateSlider:function(e){var t=this,a=l();return!(this.params.mousewheel.thresholdDelta&&e.delta<this.params.mousewheel.thresholdDelta)&&(!(this.params.mousewheel.thresholdTime&&x()-t.mousewheel.lastScrollTime<this.params.mousewheel.thresholdTime)&&(e.delta>=6&&x()-t.mousewheel.lastScrollTime<60||(e.direction<0?t.isEnd&&!t.params.loop||t.animating||(t.slideNext(),t.emit("scroll",e.raw)):t.isBeginning&&!t.params.loop||t.animating||(t.slidePrev(),t.emit("scroll",e.raw)),t.mousewheel.lastScrollTime=(new a.Date).getTime(),!1)))},releaseScroll:function(e){var t=this,a=t.params.mousewheel;if(e.direction<0){if(t.isEnd&&!t.params.loop&&a.releaseOnEdges)return!0}else if(t.isBeginning&&!t.params.loop&&a.releaseOnEdges)return!0;return!1},enable:function(){var e=this,t=J.event();if(e.params.cssMode)return e.wrapperEl.removeEventListener(t,e.mousewheel.handle),!0;if(!t)return!1;if(e.mousewheel.enabled)return!1;var a=e.$el;return"container"!==e.params.mousewheel.eventsTarget&&(a=m(e.params.mousewheel.eventsTarget)),a.on("mouseenter",e.mousewheel.handleMouseEnter),a.on("mouseleave",e.mousewheel.handleMouseLeave),a.on(t,e.mousewheel.handle),e.mousewheel.enabled=!0,!0},disable:function(){var e=this,t=J.event();if(e.params.cssMode)return e.wrapperEl.addEventListener(t,e.mousewheel.handle),!0;if(!t)return!1;if(!e.mousewheel.enabled)return!1;var a=e.$el;return"container"!==e.params.mousewheel.eventsTarget&&(a=m(e.params.mousewheel.eventsTarget)),a.off(t,e.mousewheel.handle),e.mousewheel.enabled=!1,!0}},Q={toggleEl:function(e,t){e[t?"addClass":"removeClass"](this.params.navigation.disabledClass),e[0]&&"BUTTON"===e[0].tagName&&(e[0].disabled=t)},update:function(){var e=this,t=e.params.navigation,a=e.navigation.toggleEl;if(!e.params.loop){var i=e.navigation,s=i.$nextEl,r=i.$prevEl;r&&r.length>0&&(e.isBeginning?a(r,!0):a(r,!1),e.params.watchOverflow&&e.enabled&&r[e.isLocked?"addClass":"removeClass"](t.lockClass)),s&&s.length>0&&(e.isEnd?a(s,!0):a(s,!1),e.params.watchOverflow&&e.enabled&&s[e.isLocked?"addClass":"removeClass"](t.lockClass))}},onPrevClick:function(e){var t=this;e.preventDefault(),t.isBeginning&&!t.params.loop||t.slidePrev()},onNextClick:function(e){var t=this;e.preventDefault(),t.isEnd&&!t.params.loop||t.slideNext()},init:function(){var e,t,a=this,i=a.params.navigation;(a.params.navigation=k(a.$el,a.params.navigation,a.params.createElements,{nextEl:"swiper-button-next",prevEl:"swiper-button-prev"}),i.nextEl||i.prevEl)&&(i.nextEl&&(e=m(i.nextEl),a.params.uniqueNavElements&&"string"==typeof i.nextEl&&e.length>1&&1===a.$el.find(i.nextEl).length&&(e=a.$el.find(i.nextEl))),i.prevEl&&(t=m(i.prevEl),a.params.uniqueNavElements&&"string"==typeof i.prevEl&&t.length>1&&1===a.$el.find(i.prevEl).length&&(t=a.$el.find(i.prevEl))),e&&e.length>0&&e.on("click",a.navigation.onNextClick),t&&t.length>0&&t.on("click",a.navigation.onPrevClick),M(a.navigation,{$nextEl:e,nextEl:e&&e[0],$prevEl:t,prevEl:t&&t[0]}),a.enabled||(e&&e.addClass(i.lockClass),t&&t.addClass(i.lockClass)))},destroy:function(){var e=this,t=e.navigation,a=t.$nextEl,i=t.$prevEl;a&&a.length&&(a.off("click",e.navigation.onNextClick),a.removeClass(e.params.navigation.disabledClass)),i&&i.length&&(i.off("click",e.navigation.onPrevClick),i.removeClass(e.params.navigation.disabledClass))}},ee={update:function(){var e=this,t=e.rtl,a=e.params.pagination;if(a.el&&e.pagination.el&&e.pagination.$el&&0!==e.pagination.$el.length){var i,s=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,r=e.pagination.$el,n=e.params.loop?Math.ceil((s-2*e.loopedSlides)/e.params.slidesPerGroup):e.snapGrid.length;if(e.params.loop?((i=Math.ceil((e.activeIndex-e.loopedSlides)/e.params.slidesPerGroup))>s-1-2*e.loopedSlides&&(i-=s-2*e.loopedSlides),i>n-1&&(i-=n),i<0&&"bullets"!==e.params.paginationType&&(i=n+i)):i=void 0!==e.snapIndex?e.snapIndex:e.activeIndex||0,"bullets"===a.type&&e.pagination.bullets&&e.pagination.bullets.length>0){var l,o,d,p=e.pagination.bullets;if(a.dynamicBullets&&(e.pagination.bulletSize=p.eq(0)[e.isHorizontal()?"outerWidth":"outerHeight"](!0),r.css(e.isHorizontal()?"width":"height",e.pagination.bulletSize*(a.dynamicMainBullets+4)+"px"),a.dynamicMainBullets>1&&void 0!==e.previousIndex&&(e.pagination.dynamicBulletIndex+=i-e.previousIndex,e.pagination.dynamicBulletIndex>a.dynamicMainBullets-1?e.pagination.dynamicBulletIndex=a.dynamicMainBullets-1:e.pagination.dynamicBulletIndex<0&&(e.pagination.dynamicBulletIndex=0)),l=i-e.pagination.dynamicBulletIndex,d=((o=l+(Math.min(p.length,a.dynamicMainBullets)-1))+l)/2),p.removeClass(a.bulletActiveClass+" "+a.bulletActiveClass+"-next "+a.bulletActiveClass+"-next-next "+a.bulletActiveClass+"-prev "+a.bulletActiveClass+"-prev-prev "+a.bulletActiveClass+"-main"),r.length>1)p.each((function(e){var t=m(e),s=t.index();s===i&&t.addClass(a.bulletActiveClass),a.dynamicBullets&&(s>=l&&s<=o&&t.addClass(a.bulletActiveClass+"-main"),s===l&&t.prev().addClass(a.bulletActiveClass+"-prev").prev().addClass(a.bulletActiveClass+"-prev-prev"),s===o&&t.next().addClass(a.bulletActiveClass+"-next").next().addClass(a.bulletActiveClass+"-next-next"))}));else{var u=p.eq(i),c=u.index();if(u.addClass(a.bulletActiveClass),a.dynamicBullets){for(var h=p.eq(l),v=p.eq(o),f=l;f<=o;f+=1)p.eq(f).addClass(a.bulletActiveClass+"-main");if(e.params.loop)if(c>=p.length-a.dynamicMainBullets){for(var g=a.dynamicMainBullets;g>=0;g-=1)p.eq(p.length-g).addClass(a.bulletActiveClass+"-main");p.eq(p.length-a.dynamicMainBullets-1).addClass(a.bulletActiveClass+"-prev")}else h.prev().addClass(a.bulletActiveClass+"-prev").prev().addClass(a.bulletActiveClass+"-prev-prev"),v.next().addClass(a.bulletActiveClass+"-next").next().addClass(a.bulletActiveClass+"-next-next");else h.prev().addClass(a.bulletActiveClass+"-prev").prev().addClass(a.bulletActiveClass+"-prev-prev"),v.next().addClass(a.bulletActiveClass+"-next").next().addClass(a.bulletActiveClass+"-next-next")}}if(a.dynamicBullets){var b=Math.min(p.length,a.dynamicMainBullets+4),w=(e.pagination.bulletSize*b-e.pagination.bulletSize)/2-d*e.pagination.bulletSize,y=t?"right":"left";p.css(e.isHorizontal()?y:"top",w+"px")}}if("fraction"===a.type&&(r.find(P(a.currentClass)).text(a.formatFractionCurrent(i+1)),r.find(P(a.totalClass)).text(a.formatFractionTotal(n))),"progressbar"===a.type){var E;E=a.progressbarOpposite?e.isHorizontal()?"vertical":"horizontal":e.isHorizontal()?"horizontal":"vertical";var x=(i+1)/n,T=1,C=1;"horizontal"===E?T=x:C=x,r.find(P(a.progressbarFillClass)).transform("translate3d(0,0,0) scaleX("+T+") scaleY("+C+")").transition(e.params.speed)}"custom"===a.type&&a.renderCustom?(r.html(a.renderCustom(e,i+1,n)),e.emit("paginationRender",r[0])):e.emit("paginationUpdate",r[0]),e.params.watchOverflow&&e.enabled&&r[e.isLocked?"addClass":"removeClass"](a.lockClass)}},render:function(){var e=this,t=e.params.pagination;if(t.el&&e.pagination.el&&e.pagination.$el&&0!==e.pagination.$el.length){var a=e.virtual&&e.params.virtual.enabled?e.virtual.slides.length:e.slides.length,i=e.pagination.$el,s="";if("bullets"===t.type){var r=e.params.loop?Math.ceil((a-2*e.loopedSlides)/e.params.slidesPerGroup):e.snapGrid.length;e.params.freeMode&&!e.params.loop&&r>a&&(r=a);for(var n=0;n<r;n+=1)t.renderBullet?s+=t.renderBullet.call(e,n,t.bulletClass):s+="<"+t.bulletElement+' class="'+t.bulletClass+'"></'+t.bulletElement+">";i.html(s),e.pagination.bullets=i.find(P(t.bulletClass))}"fraction"===t.type&&(s=t.renderFraction?t.renderFraction.call(e,t.currentClass,t.totalClass):'<span class="'+t.currentClass+'"></span> / <span class="'+t.totalClass+'"></span>',i.html(s)),"progressbar"===t.type&&(s=t.renderProgressbar?t.renderProgressbar.call(e,t.progressbarFillClass):'<span class="'+t.progressbarFillClass+'"></span>',i.html(s)),"custom"!==t.type&&e.emit("paginationRender",e.pagination.$el[0])}},init:function(){var e=this;e.params.pagination=k(e.$el,e.params.pagination,e.params.createElements,{el:"swiper-pagination"});var t=e.params.pagination;if(t.el){var a=m(t.el);0!==a.length&&(e.params.uniqueNavElements&&"string"==typeof t.el&&a.length>1&&(a=e.$el.find(t.el)),"bullets"===t.type&&t.clickable&&a.addClass(t.clickableClass),a.addClass(t.modifierClass+t.type),"bullets"===t.type&&t.dynamicBullets&&(a.addClass(""+t.modifierClass+t.type+"-dynamic"),e.pagination.dynamicBulletIndex=0,t.dynamicMainBullets<1&&(t.dynamicMainBullets=1)),"progressbar"===t.type&&t.progressbarOpposite&&a.addClass(t.progressbarOppositeClass),t.clickable&&a.on("click",P(t.bulletClass),(function(t){t.preventDefault();var a=m(this).index()*e.params.slidesPerGroup;e.params.loop&&(a+=e.loopedSlides),e.slideTo(a)})),M(e.pagination,{$el:a,el:a[0]}),e.enabled||a.addClass(t.lockClass))}},destroy:function(){var e=this,t=e.params.pagination;if(t.el&&e.pagination.el&&e.pagination.$el&&0!==e.pagination.$el.length){var a=e.pagination.$el;a.removeClass(t.hiddenClass),a.removeClass(t.modifierClass+t.type),e.pagination.bullets&&e.pagination.bullets.removeClass(t.bulletActiveClass),t.clickable&&a.off("click",P(t.bulletClass))}}},te={setTranslate:function(){var e=this;if(e.params.scrollbar.el&&e.scrollbar.el){var t=e.scrollbar,a=e.rtlTranslate,i=e.progress,s=t.dragSize,r=t.trackSize,n=t.$dragEl,l=t.$el,o=e.params.scrollbar,d=s,p=(r-s)*i;a?(p=-p)>0?(d=s-p,p=0):-p+s>r&&(d=r+p):p<0?(d=s+p,p=0):p+s>r&&(d=r-p),e.isHorizontal()?(n.transform("translate3d("+p+"px, 0, 0)"),n[0].style.width=d+"px"):(n.transform("translate3d(0px, "+p+"px, 0)"),n[0].style.height=d+"px"),o.hide&&(clearTimeout(e.scrollbar.timeout),l[0].style.opacity=1,e.scrollbar.timeout=setTimeout((function(){l[0].style.opacity=0,l.transition(400)}),1e3))}},setTransition:function(e){var t=this;t.params.scrollbar.el&&t.scrollbar.el&&t.scrollbar.$dragEl.transition(e)},updateSize:function(){var e=this;if(e.params.scrollbar.el&&e.scrollbar.el){var t=e.scrollbar,a=t.$dragEl,i=t.$el;a[0].style.width="",a[0].style.height="";var s,r=e.isHorizontal()?i[0].offsetWidth:i[0].offsetHeight,n=e.size/e.virtualSize,l=n*(r/e.size);s="auto"===e.params.scrollbar.dragSize?r*n:parseInt(e.params.scrollbar.dragSize,10),e.isHorizontal()?a[0].style.width=s+"px":a[0].style.height=s+"px",i[0].style.display=n>=1?"none":"",e.params.scrollbar.hide&&(i[0].style.opacity=0),M(t,{trackSize:r,divider:n,moveDivider:l,dragSize:s}),e.params.watchOverflow&&e.enabled&&t.$el[e.isLocked?"addClass":"removeClass"](e.params.scrollbar.lockClass)}},getPointerPosition:function(e){return this.isHorizontal()?"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].clientX:e.clientX:"touchstart"===e.type||"touchmove"===e.type?e.targetTouches[0].clientY:e.clientY},setDragPosition:function(e){var t,a=this,i=a.scrollbar,s=a.rtlTranslate,r=i.$el,n=i.dragSize,l=i.trackSize,o=i.dragStartPos;t=(i.getPointerPosition(e)-r.offset()[a.isHorizontal()?"left":"top"]-(null!==o?o:n/2))/(l-n),t=Math.max(Math.min(t,1),0),s&&(t=1-t);var d=a.minTranslate()+(a.maxTranslate()-a.minTranslate())*t;a.updateProgress(d),a.setTranslate(d),a.updateActiveIndex(),a.updateSlidesClasses()},onDragStart:function(e){var t=this,a=t.params.scrollbar,i=t.scrollbar,s=t.$wrapperEl,r=i.$el,n=i.$dragEl;t.scrollbar.isTouched=!0,t.scrollbar.dragStartPos=e.target===n[0]||e.target===n?i.getPointerPosition(e)-e.target.getBoundingClientRect()[t.isHorizontal()?"left":"top"]:null,e.preventDefault(),e.stopPropagation(),s.transition(100),n.transition(100),i.setDragPosition(e),clearTimeout(t.scrollbar.dragTimeout),r.transition(0),a.hide&&r.css("opacity",1),t.params.cssMode&&t.$wrapperEl.css("scroll-snap-type","none"),t.emit("scrollbarDragStart",e)},onDragMove:function(e){var t=this,a=t.scrollbar,i=t.$wrapperEl,s=a.$el,r=a.$dragEl;t.scrollbar.isTouched&&(e.preventDefault?e.preventDefault():e.returnValue=!1,a.setDragPosition(e),i.transition(0),s.transition(0),r.transition(0),t.emit("scrollbarDragMove",e))},onDragEnd:function(e){var t=this,a=t.params.scrollbar,i=t.scrollbar,s=t.$wrapperEl,r=i.$el;t.scrollbar.isTouched&&(t.scrollbar.isTouched=!1,t.params.cssMode&&(t.$wrapperEl.css("scroll-snap-type",""),s.transition("")),a.hide&&(clearTimeout(t.scrollbar.dragTimeout),t.scrollbar.dragTimeout=E((function(){r.css("opacity",0),r.transition(400)}),1e3)),t.emit("scrollbarDragEnd",e),a.snapOnRelease&&t.slideToClosest())},enableDraggable:function(){var e=this;if(e.params.scrollbar.el){var t=r(),a=e.scrollbar,i=e.touchEventsTouch,s=e.touchEventsDesktop,n=e.params,l=e.support,o=a.$el[0],d=!(!l.passiveListener||!n.passiveListeners)&&{passive:!1,capture:!1},p=!(!l.passiveListener||!n.passiveListeners)&&{passive:!0,capture:!1};o&&(l.touch?(o.addEventListener(i.start,e.scrollbar.onDragStart,d),o.addEventListener(i.move,e.scrollbar.onDragMove,d),o.addEventListener(i.end,e.scrollbar.onDragEnd,p)):(o.addEventListener(s.start,e.scrollbar.onDragStart,d),t.addEventListener(s.move,e.scrollbar.onDragMove,d),t.addEventListener(s.end,e.scrollbar.onDragEnd,p)))}},disableDraggable:function(){var e=this;if(e.params.scrollbar.el){var t=r(),a=e.scrollbar,i=e.touchEventsTouch,s=e.touchEventsDesktop,n=e.params,l=e.support,o=a.$el[0],d=!(!l.passiveListener||!n.passiveListeners)&&{passive:!1,capture:!1},p=!(!l.passiveListener||!n.passiveListeners)&&{passive:!0,capture:!1};o&&(l.touch?(o.removeEventListener(i.start,e.scrollbar.onDragStart,d),o.removeEventListener(i.move,e.scrollbar.onDragMove,d),o.removeEventListener(i.end,e.scrollbar.onDragEnd,p)):(o.removeEventListener(s.start,e.scrollbar.onDragStart,d),t.removeEventListener(s.move,e.scrollbar.onDragMove,d),t.removeEventListener(s.end,e.scrollbar.onDragEnd,p)))}},init:function(){var e=this,t=e.scrollbar,a=e.$el;e.params.scrollbar=k(a,e.params.scrollbar,e.params.createElements,{el:"swiper-scrollbar"});var i=e.params.scrollbar;if(i.el){var s=m(i.el);e.params.uniqueNavElements&&"string"==typeof i.el&&s.length>1&&1===a.find(i.el).length&&(s=a.find(i.el));var r=s.find("."+e.params.scrollbar.dragClass);0===r.length&&(r=m('<div class="'+e.params.scrollbar.dragClass+'"></div>'),s.append(r)),M(t,{$el:s,el:s[0],$dragEl:r,dragEl:r[0]}),i.draggable&&t.enableDraggable(),s&&s[e.enabled?"removeClass":"addClass"](e.params.scrollbar.lockClass)}},destroy:function(){this.scrollbar.disableDraggable()}},ae={setTransform:function(e,t){var a=this.rtl,i=m(e),s=a?-1:1,r=i.attr("data-swiper-parallax")||"0",n=i.attr("data-swiper-parallax-x"),l=i.attr("data-swiper-parallax-y"),o=i.attr("data-swiper-parallax-scale"),d=i.attr("data-swiper-parallax-opacity");if(n||l?(n=n||"0",l=l||"0"):this.isHorizontal()?(n=r,l="0"):(l=r,n="0"),n=n.indexOf("%")>=0?parseInt(n,10)*t*s+"%":n*t*s+"px",l=l.indexOf("%")>=0?parseInt(l,10)*t+"%":l*t+"px",null!=d){var p=d-(d-1)*(1-Math.abs(t));i[0].style.opacity=p}if(null==o)i.transform("translate3d("+n+", "+l+", 0px)");else{var u=o-(o-1)*(1-Math.abs(t));i.transform("translate3d("+n+", "+l+", 0px) scale("+u+")")}},setTranslate:function(){var e=this,t=e.$el,a=e.slides,i=e.progress,s=e.snapGrid;t.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t){e.parallax.setTransform(t,i)})),a.each((function(t,a){var r=t.progress;e.params.slidesPerGroup>1&&"auto"!==e.params.slidesPerView&&(r+=Math.ceil(a/2)-i*(s.length-1)),r=Math.min(Math.max(r,-1),1),m(t).find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t){e.parallax.setTransform(t,r)}))}))},setTransition:function(e){void 0===e&&(e=this.params.speed);this.$el.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y], [data-swiper-parallax-opacity], [data-swiper-parallax-scale]").each((function(t){var a=m(t),i=parseInt(a.attr("data-swiper-parallax-duration"),10)||e;0===e&&(i=0),a.transition(i)}))}},ie={getDistanceBetweenTouches:function(e){if(e.targetTouches.length<2)return 1;var t=e.targetTouches[0].pageX,a=e.targetTouches[0].pageY,i=e.targetTouches[1].pageX,s=e.targetTouches[1].pageY;return Math.sqrt(Math.pow(i-t,2)+Math.pow(s-a,2))},onGestureStart:function(e){var t=this,a=t.support,i=t.params.zoom,s=t.zoom,r=s.gesture;if(s.fakeGestureTouched=!1,s.fakeGestureMoved=!1,!a.gestures){if("touchstart"!==e.type||"touchstart"===e.type&&e.targetTouches.length<2)return;s.fakeGestureTouched=!0,r.scaleStart=ie.getDistanceBetweenTouches(e)}r.$slideEl&&r.$slideEl.length||(r.$slideEl=m(e.target).closest("."+t.params.slideClass),0===r.$slideEl.length&&(r.$slideEl=t.slides.eq(t.activeIndex)),r.$imageEl=r.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),r.$imageWrapEl=r.$imageEl.parent("."+i.containerClass),r.maxRatio=r.$imageWrapEl.attr("data-swiper-zoom")||i.maxRatio,0!==r.$imageWrapEl.length)?(r.$imageEl&&r.$imageEl.transition(0),t.zoom.isScaling=!0):r.$imageEl=void 0},onGestureChange:function(e){var t=this,a=t.support,i=t.params.zoom,s=t.zoom,r=s.gesture;if(!a.gestures){if("touchmove"!==e.type||"touchmove"===e.type&&e.targetTouches.length<2)return;s.fakeGestureMoved=!0,r.scaleMove=ie.getDistanceBetweenTouches(e)}r.$imageEl&&0!==r.$imageEl.length?(a.gestures?s.scale=e.scale*s.currentScale:s.scale=r.scaleMove/r.scaleStart*s.currentScale,s.scale>r.maxRatio&&(s.scale=r.maxRatio-1+Math.pow(s.scale-r.maxRatio+1,.5)),s.scale<i.minRatio&&(s.scale=i.minRatio+1-Math.pow(i.minRatio-s.scale+1,.5)),r.$imageEl.transform("translate3d(0,0,0) scale("+s.scale+")")):"gesturechange"===e.type&&s.onGestureStart(e)},onGestureEnd:function(e){var t=this,a=t.device,i=t.support,s=t.params.zoom,r=t.zoom,n=r.gesture;if(!i.gestures){if(!r.fakeGestureTouched||!r.fakeGestureMoved)return;if("touchend"!==e.type||"touchend"===e.type&&e.changedTouches.length<2&&!a.android)return;r.fakeGestureTouched=!1,r.fakeGestureMoved=!1}n.$imageEl&&0!==n.$imageEl.length&&(r.scale=Math.max(Math.min(r.scale,n.maxRatio),s.minRatio),n.$imageEl.transition(t.params.speed).transform("translate3d(0,0,0) scale("+r.scale+")"),r.currentScale=r.scale,r.isScaling=!1,1===r.scale&&(n.$slideEl=void 0))},onTouchStart:function(e){var t=this.device,a=this.zoom,i=a.gesture,s=a.image;i.$imageEl&&0!==i.$imageEl.length&&(s.isTouched||(t.android&&e.cancelable&&e.preventDefault(),s.isTouched=!0,s.touchesStart.x="touchstart"===e.type?e.targetTouches[0].pageX:e.pageX,s.touchesStart.y="touchstart"===e.type?e.targetTouches[0].pageY:e.pageY))},onTouchMove:function(e){var t=this,a=t.zoom,i=a.gesture,s=a.image,r=a.velocity;if(i.$imageEl&&0!==i.$imageEl.length&&(t.allowClick=!1,s.isTouched&&i.$slideEl)){s.isMoved||(s.width=i.$imageEl[0].offsetWidth,s.height=i.$imageEl[0].offsetHeight,s.startX=T(i.$imageWrapEl[0],"x")||0,s.startY=T(i.$imageWrapEl[0],"y")||0,i.slideWidth=i.$slideEl[0].offsetWidth,i.slideHeight=i.$slideEl[0].offsetHeight,i.$imageWrapEl.transition(0));var n=s.width*a.scale,l=s.height*a.scale;if(!(n<i.slideWidth&&l<i.slideHeight)){if(s.minX=Math.min(i.slideWidth/2-n/2,0),s.maxX=-s.minX,s.minY=Math.min(i.slideHeight/2-l/2,0),s.maxY=-s.minY,s.touchesCurrent.x="touchmove"===e.type?e.targetTouches[0].pageX:e.pageX,s.touchesCurrent.y="touchmove"===e.type?e.targetTouches[0].pageY:e.pageY,!s.isMoved&&!a.isScaling){if(t.isHorizontal()&&(Math.floor(s.minX)===Math.floor(s.startX)&&s.touchesCurrent.x<s.touchesStart.x||Math.floor(s.maxX)===Math.floor(s.startX)&&s.touchesCurrent.x>s.touchesStart.x))return void(s.isTouched=!1);if(!t.isHorizontal()&&(Math.floor(s.minY)===Math.floor(s.startY)&&s.touchesCurrent.y<s.touchesStart.y||Math.floor(s.maxY)===Math.floor(s.startY)&&s.touchesCurrent.y>s.touchesStart.y))return void(s.isTouched=!1)}e.cancelable&&e.preventDefault(),e.stopPropagation(),s.isMoved=!0,s.currentX=s.touchesCurrent.x-s.touchesStart.x+s.startX,s.currentY=s.touchesCurrent.y-s.touchesStart.y+s.startY,s.currentX<s.minX&&(s.currentX=s.minX+1-Math.pow(s.minX-s.currentX+1,.8)),s.currentX>s.maxX&&(s.currentX=s.maxX-1+Math.pow(s.currentX-s.maxX+1,.8)),s.currentY<s.minY&&(s.currentY=s.minY+1-Math.pow(s.minY-s.currentY+1,.8)),s.currentY>s.maxY&&(s.currentY=s.maxY-1+Math.pow(s.currentY-s.maxY+1,.8)),r.prevPositionX||(r.prevPositionX=s.touchesCurrent.x),r.prevPositionY||(r.prevPositionY=s.touchesCurrent.y),r.prevTime||(r.prevTime=Date.now()),r.x=(s.touchesCurrent.x-r.prevPositionX)/(Date.now()-r.prevTime)/2,r.y=(s.touchesCurrent.y-r.prevPositionY)/(Date.now()-r.prevTime)/2,Math.abs(s.touchesCurrent.x-r.prevPositionX)<2&&(r.x=0),Math.abs(s.touchesCurrent.y-r.prevPositionY)<2&&(r.y=0),r.prevPositionX=s.touchesCurrent.x,r.prevPositionY=s.touchesCurrent.y,r.prevTime=Date.now(),i.$imageWrapEl.transform("translate3d("+s.currentX+"px, "+s.currentY+"px,0)")}}},onTouchEnd:function(){var e=this.zoom,t=e.gesture,a=e.image,i=e.velocity;if(t.$imageEl&&0!==t.$imageEl.length){if(!a.isTouched||!a.isMoved)return a.isTouched=!1,void(a.isMoved=!1);a.isTouched=!1,a.isMoved=!1;var s=300,r=300,n=i.x*s,l=a.currentX+n,o=i.y*r,d=a.currentY+o;0!==i.x&&(s=Math.abs((l-a.currentX)/i.x)),0!==i.y&&(r=Math.abs((d-a.currentY)/i.y));var p=Math.max(s,r);a.currentX=l,a.currentY=d;var u=a.width*e.scale,c=a.height*e.scale;a.minX=Math.min(t.slideWidth/2-u/2,0),a.maxX=-a.minX,a.minY=Math.min(t.slideHeight/2-c/2,0),a.maxY=-a.minY,a.currentX=Math.max(Math.min(a.currentX,a.maxX),a.minX),a.currentY=Math.max(Math.min(a.currentY,a.maxY),a.minY),t.$imageWrapEl.transition(p).transform("translate3d("+a.currentX+"px, "+a.currentY+"px,0)")}},onTransitionEnd:function(){var e=this,t=e.zoom,a=t.gesture;a.$slideEl&&e.previousIndex!==e.activeIndex&&(a.$imageEl&&a.$imageEl.transform("translate3d(0,0,0) scale(1)"),a.$imageWrapEl&&a.$imageWrapEl.transform("translate3d(0,0,0)"),t.scale=1,t.currentScale=1,a.$slideEl=void 0,a.$imageEl=void 0,a.$imageWrapEl=void 0)},toggle:function(e){var t=this.zoom;t.scale&&1!==t.scale?t.out():t.in(e)},in:function(e){var t,a,i,s,r,n,o,d,p,u,c,h,v,f,g,b,w=this,y=l(),E=w.zoom,x=w.params.zoom,T=E.gesture,C=E.image;(T.$slideEl||(e&&e.target&&(T.$slideEl=m(e.target).closest("."+w.params.slideClass)),T.$slideEl||(w.params.virtual&&w.params.virtual.enabled&&w.virtual?T.$slideEl=w.$wrapperEl.children("."+w.params.slideActiveClass):T.$slideEl=w.slides.eq(w.activeIndex)),T.$imageEl=T.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),T.$imageWrapEl=T.$imageEl.parent("."+x.containerClass)),T.$imageEl&&0!==T.$imageEl.length&&T.$imageWrapEl&&0!==T.$imageWrapEl.length)&&(T.$slideEl.addClass(""+x.zoomedSlideClass),void 0===C.touchesStart.x&&e?(t="touchend"===e.type?e.changedTouches[0].pageX:e.pageX,a="touchend"===e.type?e.changedTouches[0].pageY:e.pageY):(t=C.touchesStart.x,a=C.touchesStart.y),E.scale=T.$imageWrapEl.attr("data-swiper-zoom")||x.maxRatio,E.currentScale=T.$imageWrapEl.attr("data-swiper-zoom")||x.maxRatio,e?(g=T.$slideEl[0].offsetWidth,b=T.$slideEl[0].offsetHeight,i=T.$slideEl.offset().left+y.scrollX+g/2-t,s=T.$slideEl.offset().top+y.scrollY+b/2-a,o=T.$imageEl[0].offsetWidth,d=T.$imageEl[0].offsetHeight,p=o*E.scale,u=d*E.scale,v=-(c=Math.min(g/2-p/2,0)),f=-(h=Math.min(b/2-u/2,0)),(r=i*E.scale)<c&&(r=c),r>v&&(r=v),(n=s*E.scale)<h&&(n=h),n>f&&(n=f)):(r=0,n=0),T.$imageWrapEl.transition(300).transform("translate3d("+r+"px, "+n+"px,0)"),T.$imageEl.transition(300).transform("translate3d(0,0,0) scale("+E.scale+")"))},out:function(){var e=this,t=e.zoom,a=e.params.zoom,i=t.gesture;i.$slideEl||(e.params.virtual&&e.params.virtual.enabled&&e.virtual?i.$slideEl=e.$wrapperEl.children("."+e.params.slideActiveClass):i.$slideEl=e.slides.eq(e.activeIndex),i.$imageEl=i.$slideEl.find("img, svg, canvas, picture, .swiper-zoom-target"),i.$imageWrapEl=i.$imageEl.parent("."+a.containerClass)),i.$imageEl&&0!==i.$imageEl.length&&i.$imageWrapEl&&0!==i.$imageWrapEl.length&&(t.scale=1,t.currentScale=1,i.$imageWrapEl.transition(300).transform("translate3d(0,0,0)"),i.$imageEl.transition(300).transform("translate3d(0,0,0) scale(1)"),i.$slideEl.removeClass(""+a.zoomedSlideClass),i.$slideEl=void 0)},toggleGestures:function(e){var t=this,a=t.zoom,i=a.slideSelector,s=a.passiveListener;t.$wrapperEl[e]("gesturestart",i,a.onGestureStart,s),t.$wrapperEl[e]("gesturechange",i,a.onGestureChange,s),t.$wrapperEl[e]("gestureend",i,a.onGestureEnd,s)},enableGestures:function(){this.zoom.gesturesEnabled||(this.zoom.gesturesEnabled=!0,this.zoom.toggleGestures("on"))},disableGestures:function(){this.zoom.gesturesEnabled&&(this.zoom.gesturesEnabled=!1,this.zoom.toggleGestures("off"))},enable:function(){var e=this,t=e.support,a=e.zoom;if(!a.enabled){a.enabled=!0;var i=!("touchstart"!==e.touchEvents.start||!t.passiveListener||!e.params.passiveListeners)&&{passive:!0,capture:!1},s=!t.passiveListener||{passive:!1,capture:!0},r="."+e.params.slideClass;e.zoom.passiveListener=i,e.zoom.slideSelector=r,t.gestures?(e.$wrapperEl.on(e.touchEvents.start,e.zoom.enableGestures,i),e.$wrapperEl.on(e.touchEvents.end,e.zoom.disableGestures,i)):"touchstart"===e.touchEvents.start&&(e.$wrapperEl.on(e.touchEvents.start,r,a.onGestureStart,i),e.$wrapperEl.on(e.touchEvents.move,r,a.onGestureChange,s),e.$wrapperEl.on(e.touchEvents.end,r,a.onGestureEnd,i),e.touchEvents.cancel&&e.$wrapperEl.on(e.touchEvents.cancel,r,a.onGestureEnd,i)),e.$wrapperEl.on(e.touchEvents.move,"."+e.params.zoom.containerClass,a.onTouchMove,s)}},disable:function(){var e=this,t=e.zoom;if(t.enabled){var a=e.support;e.zoom.enabled=!1;var i=!("touchstart"!==e.touchEvents.start||!a.passiveListener||!e.params.passiveListeners)&&{passive:!0,capture:!1},s=!a.passiveListener||{passive:!1,capture:!0},r="."+e.params.slideClass;a.gestures?(e.$wrapperEl.off(e.touchEvents.start,e.zoom.enableGestures,i),e.$wrapperEl.off(e.touchEvents.end,e.zoom.disableGestures,i)):"touchstart"===e.touchEvents.start&&(e.$wrapperEl.off(e.touchEvents.start,r,t.onGestureStart,i),e.$wrapperEl.off(e.touchEvents.move,r,t.onGestureChange,s),e.$wrapperEl.off(e.touchEvents.end,r,t.onGestureEnd,i),e.touchEvents.cancel&&e.$wrapperEl.off(e.touchEvents.cancel,r,t.onGestureEnd,i)),e.$wrapperEl.off(e.touchEvents.move,"."+e.params.zoom.containerClass,t.onTouchMove,s)}}},se={loadInSlide:function(e,t){void 0===t&&(t=!0);var a=this,i=a.params.lazy;if(void 0!==e&&0!==a.slides.length){var s=a.virtual&&a.params.virtual.enabled?a.$wrapperEl.children("."+a.params.slideClass+'[data-swiper-slide-index="'+e+'"]'):a.slides.eq(e),r=s.find("."+i.elementClass+":not(."+i.loadedClass+"):not(."+i.loadingClass+")");!s.hasClass(i.elementClass)||s.hasClass(i.loadedClass)||s.hasClass(i.loadingClass)||r.push(s[0]),0!==r.length&&r.each((function(e){var r=m(e);r.addClass(i.loadingClass);var n=r.attr("data-background"),l=r.attr("data-src"),o=r.attr("data-srcset"),d=r.attr("data-sizes"),p=r.parent("picture");a.loadImage(r[0],l||n,o,d,!1,(function(){if(null!=a&&a&&(!a||a.params)&&!a.destroyed){if(n?(r.css("background-image",'url("'+n+'")'),r.removeAttr("data-background")):(o&&(r.attr("srcset",o),r.removeAttr("data-srcset")),d&&(r.attr("sizes",d),r.removeAttr("data-sizes")),p.length&&p.children("source").each((function(e){var t=m(e);t.attr("data-srcset")&&(t.attr("srcset",t.attr("data-srcset")),t.removeAttr("data-srcset"))})),l&&(r.attr("src",l),r.removeAttr("data-src"))),r.addClass(i.loadedClass).removeClass(i.loadingClass),s.find("."+i.preloaderClass).remove(),a.params.loop&&t){var e=s.attr("data-swiper-slide-index");if(s.hasClass(a.params.slideDuplicateClass)){var u=a.$wrapperEl.children('[data-swiper-slide-index="'+e+'"]:not(.'+a.params.slideDuplicateClass+")");a.lazy.loadInSlide(u.index(),!1)}else{var c=a.$wrapperEl.children("."+a.params.slideDuplicateClass+'[data-swiper-slide-index="'+e+'"]');a.lazy.loadInSlide(c.index(),!1)}}a.emit("lazyImageReady",s[0],r[0]),a.params.autoHeight&&a.updateAutoHeight()}})),a.emit("lazyImageLoad",s[0],r[0])}))}},load:function(){var e=this,t=e.$wrapperEl,a=e.params,i=e.slides,s=e.activeIndex,r=e.virtual&&a.virtual.enabled,n=a.lazy,l=a.slidesPerView;function o(e){if(r){if(t.children("."+a.slideClass+'[data-swiper-slide-index="'+e+'"]').length)return!0}else if(i[e])return!0;return!1}function d(e){return r?m(e).attr("data-swiper-slide-index"):m(e).index()}if("auto"===l&&(l=0),e.lazy.initialImageLoaded||(e.lazy.initialImageLoaded=!0),e.params.watchSlidesVisibility)t.children("."+a.slideVisibleClass).each((function(t){var a=r?m(t).attr("data-swiper-slide-index"):m(t).index();e.lazy.loadInSlide(a)}));else if(l>1)for(var p=s;p<s+l;p+=1)o(p)&&e.lazy.loadInSlide(p);else e.lazy.loadInSlide(s);if(n.loadPrevNext)if(l>1||n.loadPrevNextAmount&&n.loadPrevNextAmount>1){for(var u=n.loadPrevNextAmount,c=l,h=Math.min(s+c+Math.max(u,c),i.length),v=Math.max(s-Math.max(c,u),0),f=s+l;f<h;f+=1)o(f)&&e.lazy.loadInSlide(f);for(var g=v;g<s;g+=1)o(g)&&e.lazy.loadInSlide(g)}else{var b=t.children("."+a.slideNextClass);b.length>0&&e.lazy.loadInSlide(d(b));var w=t.children("."+a.slidePrevClass);w.length>0&&e.lazy.loadInSlide(d(w))}},checkInViewOnLoad:function(){var e=l(),t=this;if(t&&!t.destroyed){var a=t.params.lazy.scrollingElement?m(t.params.lazy.scrollingElement):m(e),i=a[0]===e,s=i?e.innerWidth:a[0].offsetWidth,r=i?e.innerHeight:a[0].offsetHeight,n=t.$el.offset(),o=!1;t.rtlTranslate&&(n.left-=t.$el[0].scrollLeft);for(var d=[[n.left,n.top],[n.left+t.width,n.top],[n.left,n.top+t.height],[n.left+t.width,n.top+t.height]],p=0;p<d.length;p+=1){var u=d[p];if(u[0]>=0&&u[0]<=s&&u[1]>=0&&u[1]<=r){if(0===u[0]&&0===u[1])continue;o=!0}}var c=!("touchstart"!==t.touchEvents.start||!t.support.passiveListener||!t.params.passiveListeners)&&{passive:!0,capture:!1};o?(t.lazy.load(),a.off("scroll",t.lazy.checkInViewOnLoad,c)):t.lazy.scrollHandlerAttached||(t.lazy.scrollHandlerAttached=!0,a.on("scroll",t.lazy.checkInViewOnLoad,c))}}},re={LinearSpline:function(e,t){var a,i,s,r,n,l=function(e,t){for(i=-1,a=e.length;a-i>1;)e[s=a+i>>1]<=t?i=s:a=s;return a};return this.x=e,this.y=t,this.lastIndex=e.length-1,this.interpolate=function(e){return e?(n=l(this.x,e),r=n-1,(e-this.x[r])*(this.y[n]-this.y[r])/(this.x[n]-this.x[r])+this.y[r]):0},this},getInterpolateFunction:function(e){var t=this;t.controller.spline||(t.controller.spline=t.params.loop?new re.LinearSpline(t.slidesGrid,e.slidesGrid):new re.LinearSpline(t.snapGrid,e.snapGrid))},setTranslate:function(e,t){var a,i,s=this,r=s.controller.control,n=s.constructor;function l(e){var t=s.rtlTranslate?-s.translate:s.translate;"slide"===s.params.controller.by&&(s.controller.getInterpolateFunction(e),i=-s.controller.spline.interpolate(-t)),i&&"container"!==s.params.controller.by||(a=(e.maxTranslate()-e.minTranslate())/(s.maxTranslate()-s.minTranslate()),i=(t-s.minTranslate())*a+e.minTranslate()),s.params.controller.inverse&&(i=e.maxTranslate()-i),e.updateProgress(i),e.setTranslate(i,s),e.updateActiveIndex(),e.updateSlidesClasses()}if(Array.isArray(r))for(var o=0;o<r.length;o+=1)r[o]!==t&&r[o]instanceof n&&l(r[o]);else r instanceof n&&t!==r&&l(r)},setTransition:function(e,t){var a,i=this,s=i.constructor,r=i.controller.control;function n(t){t.setTransition(e,i),0!==e&&(t.transitionStart(),t.params.autoHeight&&E((function(){t.updateAutoHeight()})),t.$wrapperEl.transitionEnd((function(){r&&(t.params.loop&&"slide"===i.params.controller.by&&t.loopFix(),t.transitionEnd())})))}if(Array.isArray(r))for(a=0;a<r.length;a+=1)r[a]!==t&&r[a]instanceof s&&n(r[a]);else r instanceof s&&t!==r&&n(r)}},ne={getRandomNumber:function(e){void 0===e&&(e=16);return"x".repeat(e).replace(/x/g,(function(){return Math.round(16*Math.random()).toString(16)}))},makeElFocusable:function(e){return e.attr("tabIndex","0"),e},makeElNotFocusable:function(e){return e.attr("tabIndex","-1"),e},addElRole:function(e,t){return e.attr("role",t),e},addElRoleDescription:function(e,t){return e.attr("aria-roledescription",t),e},addElControls:function(e,t){return e.attr("aria-controls",t),e},addElLabel:function(e,t){return e.attr("aria-label",t),e},addElId:function(e,t){return e.attr("id",t),e},addElLive:function(e,t){return e.attr("aria-live",t),e},disableEl:function(e){return e.attr("aria-disabled",!0),e},enableEl:function(e){return e.attr("aria-disabled",!1),e},onEnterOrSpaceKey:function(e){if(13===e.keyCode||32===e.keyCode){var t=this,a=t.params.a11y,i=m(e.target);t.navigation&&t.navigation.$nextEl&&i.is(t.navigation.$nextEl)&&(t.isEnd&&!t.params.loop||t.slideNext(),t.isEnd?t.a11y.notify(a.lastSlideMessage):t.a11y.notify(a.nextSlideMessage)),t.navigation&&t.navigation.$prevEl&&i.is(t.navigation.$prevEl)&&(t.isBeginning&&!t.params.loop||t.slidePrev(),t.isBeginning?t.a11y.notify(a.firstSlideMessage):t.a11y.notify(a.prevSlideMessage)),t.pagination&&i.is(P(t.params.pagination.bulletClass))&&i[0].click()}},notify:function(e){var t=this.a11y.liveRegion;0!==t.length&&(t.html(""),t.html(e))},updateNavigation:function(){var e=this;if(!e.params.loop&&e.navigation){var t=e.navigation,a=t.$nextEl,i=t.$prevEl;i&&i.length>0&&(e.isBeginning?(e.a11y.disableEl(i),e.a11y.makeElNotFocusable(i)):(e.a11y.enableEl(i),e.a11y.makeElFocusable(i))),a&&a.length>0&&(e.isEnd?(e.a11y.disableEl(a),e.a11y.makeElNotFocusable(a)):(e.a11y.enableEl(a),e.a11y.makeElFocusable(a)))}},updatePagination:function(){var e=this,t=e.params.a11y;e.pagination&&e.params.pagination.clickable&&e.pagination.bullets&&e.pagination.bullets.length&&e.pagination.bullets.each((function(a){var i=m(a);e.a11y.makeElFocusable(i),e.params.pagination.renderBullet||(e.a11y.addElRole(i,"button"),e.a11y.addElLabel(i,t.paginationBulletMessage.replace(/\{\{index\}\}/,i.index()+1)))}))},init:function(){var e=this,t=e.params.a11y;e.$el.append(e.a11y.liveRegion);var a=e.$el;t.containerRoleDescriptionMessage&&e.a11y.addElRoleDescription(a,t.containerRoleDescriptionMessage),t.containerMessage&&e.a11y.addElLabel(a,t.containerMessage);var i=e.$wrapperEl,s=i.attr("id")||"swiper-wrapper-"+e.a11y.getRandomNumber(16),r=e.params.autoplay&&e.params.autoplay.enabled?"off":"polite";e.a11y.addElId(i,s),e.a11y.addElLive(i,r),t.itemRoleDescriptionMessage&&e.a11y.addElRoleDescription(m(e.slides),t.itemRoleDescriptionMessage),e.a11y.addElRole(m(e.slides),t.slideRole);var n,l,o=e.params.loop?e.slides.filter((function(t){return!t.classList.contains(e.params.slideDuplicateClass)})).length:e.slides.length;e.slides.each((function(a,i){var s=m(a),r=e.params.loop?parseInt(s.attr("data-swiper-slide-index"),10):i,n=t.slideLabelMessage.replace(/\{\{index\}\}/,r+1).replace(/\{\{slidesLength\}\}/,o);e.a11y.addElLabel(s,n)})),e.navigation&&e.navigation.$nextEl&&(n=e.navigation.$nextEl),e.navigation&&e.navigation.$prevEl&&(l=e.navigation.$prevEl),n&&n.length&&(e.a11y.makeElFocusable(n),"BUTTON"!==n[0].tagName&&(e.a11y.addElRole(n,"button"),n.on("keydown",e.a11y.onEnterOrSpaceKey)),e.a11y.addElLabel(n,t.nextSlideMessage),e.a11y.addElControls(n,s)),l&&l.length&&(e.a11y.makeElFocusable(l),"BUTTON"!==l[0].tagName&&(e.a11y.addElRole(l,"button"),l.on("keydown",e.a11y.onEnterOrSpaceKey)),e.a11y.addElLabel(l,t.prevSlideMessage),e.a11y.addElControls(l,s)),e.pagination&&e.params.pagination.clickable&&e.pagination.bullets&&e.pagination.bullets.length&&e.pagination.$el.on("keydown",P(e.params.pagination.bulletClass),e.a11y.onEnterOrSpaceKey)},destroy:function(){var e,t,a=this;a.a11y.liveRegion&&a.a11y.liveRegion.length>0&&a.a11y.liveRegion.remove(),a.navigation&&a.navigation.$nextEl&&(e=a.navigation.$nextEl),a.navigation&&a.navigation.$prevEl&&(t=a.navigation.$prevEl),e&&e.off("keydown",a.a11y.onEnterOrSpaceKey),t&&t.off("keydown",a.a11y.onEnterOrSpaceKey),a.pagination&&a.params.pagination.clickable&&a.pagination.bullets&&a.pagination.bullets.length&&a.pagination.$el.off("keydown",P(a.params.pagination.bulletClass),a.a11y.onEnterOrSpaceKey)}},le={init:function(){var e=this,t=l();if(e.params.history){if(!t.history||!t.history.pushState)return e.params.history.enabled=!1,void(e.params.hashNavigation.enabled=!0);var a=e.history;a.initialized=!0,a.paths=le.getPathValues(e.params.url),(a.paths.key||a.paths.value)&&(a.scrollToSlide(0,a.paths.value,e.params.runCallbacksOnInit),e.params.history.replaceState||t.addEventListener("popstate",e.history.setHistoryPopState))}},destroy:function(){var e=l();this.params.history.replaceState||e.removeEventListener("popstate",this.history.setHistoryPopState)},setHistoryPopState:function(){var e=this;e.history.paths=le.getPathValues(e.params.url),e.history.scrollToSlide(e.params.speed,e.history.paths.value,!1)},getPathValues:function(e){var t=l(),a=(e?new URL(e):t.location).pathname.slice(1).split("/").filter((function(e){return""!==e})),i=a.length;return{key:a[i-2],value:a[i-1]}},setHistory:function(e,t){var a=this,i=l();if(a.history.initialized&&a.params.history.enabled){var s;s=a.params.url?new URL(a.params.url):i.location;var r=a.slides.eq(t),n=le.slugify(r.attr("data-history"));if(a.params.history.root.length>0){var o=a.params.history.root;"/"===o[o.length-1]&&(o=o.slice(0,o.length-1)),n=o+"/"+e+"/"+n}else s.pathname.includes(e)||(n=e+"/"+n);var d=i.history.state;d&&d.value===n||(a.params.history.replaceState?i.history.replaceState({value:n},null,n):i.history.pushState({value:n},null,n))}},slugify:function(e){return e.toString().replace(/\s+/g,"-").replace(/[^\w-]+/g,"").replace(/--+/g,"-").replace(/^-+/,"").replace(/-+$/,"")},scrollToSlide:function(e,t,a){var i=this;if(t)for(var s=0,r=i.slides.length;s<r;s+=1){var n=i.slides.eq(s);if(le.slugify(n.attr("data-history"))===t&&!n.hasClass(i.params.slideDuplicateClass)){var l=n.index();i.slideTo(l,e,a)}}else i.slideTo(0,e,a)}},oe={onHashChange:function(){var e=this,t=r();e.emit("hashChange");var a=t.location.hash.replace("#","");if(a!==e.slides.eq(e.activeIndex).attr("data-hash")){var i=e.$wrapperEl.children("."+e.params.slideClass+'[data-hash="'+a+'"]').index();if(void 0===i)return;e.slideTo(i)}},setHash:function(){var e=this,t=l(),a=r();if(e.hashNavigation.initialized&&e.params.hashNavigation.enabled)if(e.params.hashNavigation.replaceState&&t.history&&t.history.replaceState)t.history.replaceState(null,null,"#"+e.slides.eq(e.activeIndex).attr("data-hash")||""),e.emit("hashSet");else{var i=e.slides.eq(e.activeIndex),s=i.attr("data-hash")||i.attr("data-history");a.location.hash=s||"",e.emit("hashSet")}},init:function(){var e=this,t=r(),a=l();if(!(!e.params.hashNavigation.enabled||e.params.history&&e.params.history.enabled)){e.hashNavigation.initialized=!0;var i=t.location.hash.replace("#","");if(i)for(var s=0,n=e.slides.length;s<n;s+=1){var o=e.slides.eq(s);if((o.attr("data-hash")||o.attr("data-history"))===i&&!o.hasClass(e.params.slideDuplicateClass)){var d=o.index();e.slideTo(d,0,e.params.runCallbacksOnInit,!0)}}e.params.hashNavigation.watchState&&m(a).on("hashchange",e.hashNavigation.onHashChange)}},destroy:function(){var e=l();this.params.hashNavigation.watchState&&m(e).off("hashchange",this.hashNavigation.onHashChange)}},de={run:function(){var e=this,t=e.slides.eq(e.activeIndex),a=e.params.autoplay.delay;t.attr("data-swiper-autoplay")&&(a=t.attr("data-swiper-autoplay")||e.params.autoplay.delay),clearTimeout(e.autoplay.timeout),e.autoplay.timeout=E((function(){var t;e.params.autoplay.reverseDirection?e.params.loop?(e.loopFix(),t=e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.isBeginning?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(t=e.slideTo(e.slides.length-1,e.params.speed,!0,!0),e.emit("autoplay")):(t=e.slidePrev(e.params.speed,!0,!0),e.emit("autoplay")):e.params.loop?(e.loopFix(),t=e.slideNext(e.params.speed,!0,!0),e.emit("autoplay")):e.isEnd?e.params.autoplay.stopOnLastSlide?e.autoplay.stop():(t=e.slideTo(0,e.params.speed,!0,!0),e.emit("autoplay")):(t=e.slideNext(e.params.speed,!0,!0),e.emit("autoplay")),(e.params.cssMode&&e.autoplay.running||!1===t)&&e.autoplay.run()}),a)},start:function(){var e=this;return void 0===e.autoplay.timeout&&(!e.autoplay.running&&(e.autoplay.running=!0,e.emit("autoplayStart"),e.autoplay.run(),!0))},stop:function(){var e=this;return!!e.autoplay.running&&(void 0!==e.autoplay.timeout&&(e.autoplay.timeout&&(clearTimeout(e.autoplay.timeout),e.autoplay.timeout=void 0),e.autoplay.running=!1,e.emit("autoplayStop"),!0))},pause:function(e){var t=this;t.autoplay.running&&(t.autoplay.paused||(t.autoplay.timeout&&clearTimeout(t.autoplay.timeout),t.autoplay.paused=!0,0!==e&&t.params.autoplay.waitForTransition?["transitionend","webkitTransitionEnd"].forEach((function(e){t.$wrapperEl[0].addEventListener(e,t.autoplay.onTransitionEnd)})):(t.autoplay.paused=!1,t.autoplay.run())))},onVisibilityChange:function(){var e=this,t=r();"hidden"===t.visibilityState&&e.autoplay.running&&e.autoplay.pause(),"visible"===t.visibilityState&&e.autoplay.paused&&(e.autoplay.run(),e.autoplay.paused=!1)},onTransitionEnd:function(e){var t=this;t&&!t.destroyed&&t.$wrapperEl&&e.target===t.$wrapperEl[0]&&(["transitionend","webkitTransitionEnd"].forEach((function(e){t.$wrapperEl[0].removeEventListener(e,t.autoplay.onTransitionEnd)})),t.autoplay.paused=!1,t.autoplay.running?t.autoplay.run():t.autoplay.stop())},onMouseEnter:function(){var e=this;e.params.autoplay.disableOnInteraction?e.autoplay.stop():e.autoplay.pause(),["transitionend","webkitTransitionEnd"].forEach((function(t){e.$wrapperEl[0].removeEventListener(t,e.autoplay.onTransitionEnd)}))},onMouseLeave:function(){var e=this;e.params.autoplay.disableOnInteraction||(e.autoplay.paused=!1,e.autoplay.run())},attachMouseEvents:function(){var e=this;e.params.autoplay.pauseOnMouseEnter&&(e.$el.on("mouseenter",e.autoplay.onMouseEnter),e.$el.on("mouseleave",e.autoplay.onMouseLeave))},detachMouseEvents:function(){var e=this;e.$el.off("mouseenter",e.autoplay.onMouseEnter),e.$el.off("mouseleave",e.autoplay.onMouseLeave)}},pe={setTranslate:function(){for(var e=this,t=e.slides,a=0;a<t.length;a+=1){var i=e.slides.eq(a),s=-i[0].swiperSlideOffset;e.params.virtualTranslate||(s-=e.translate);var r=0;e.isHorizontal()||(r=s,s=0);var n=e.params.fadeEffect.crossFade?Math.max(1-Math.abs(i[0].progress),0):1+Math.min(Math.max(i[0].progress,-1),0);i.css({opacity:n}).transform("translate3d("+s+"px, "+r+"px, 0px)")}},setTransition:function(e){var t=this,a=t.slides,i=t.$wrapperEl;if(a.transition(e),t.params.virtualTranslate&&0!==e){var s=!1;a.transitionEnd((function(){if(!s&&t&&!t.destroyed){s=!0,t.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],a=0;a<e.length;a+=1)i.trigger(e[a])}}))}}},ue={setTranslate:function(){var e,t=this,a=t.$el,i=t.$wrapperEl,s=t.slides,r=t.width,n=t.height,l=t.rtlTranslate,o=t.size,d=t.browser,p=t.params.cubeEffect,u=t.isHorizontal(),c=t.virtual&&t.params.virtual.enabled,h=0;p.shadow&&(u?(0===(e=i.find(".swiper-cube-shadow")).length&&(e=m('<div class="swiper-cube-shadow"></div>'),i.append(e)),e.css({height:r+"px"})):0===(e=a.find(".swiper-cube-shadow")).length&&(e=m('<div class="swiper-cube-shadow"></div>'),a.append(e)));for(var v=0;v<s.length;v+=1){var f=s.eq(v),g=v;c&&(g=parseInt(f.attr("data-swiper-slide-index"),10));var b=90*g,w=Math.floor(b/360);l&&(b=-b,w=Math.floor(-b/360));var y=Math.max(Math.min(f[0].progress,1),-1),E=0,x=0,T=0;g%4==0?(E=4*-w*o,T=0):(g-1)%4==0?(E=0,T=4*-w*o):(g-2)%4==0?(E=o+4*w*o,T=o):(g-3)%4==0&&(E=-o,T=3*o+4*o*w),l&&(E=-E),u||(x=E,E=0);var C="rotateX("+(u?0:-b)+"deg) rotateY("+(u?b:0)+"deg) translate3d("+E+"px, "+x+"px, "+T+"px)";if(y<=1&&y>-1&&(h=90*g+90*y,l&&(h=90*-g-90*y)),f.transform(C),p.slideShadows){var S=u?f.find(".swiper-slide-shadow-left"):f.find(".swiper-slide-shadow-top"),M=u?f.find(".swiper-slide-shadow-right"):f.find(".swiper-slide-shadow-bottom");0===S.length&&(S=m('<div class="swiper-slide-shadow-'+(u?"left":"top")+'"></div>'),f.append(S)),0===M.length&&(M=m('<div class="swiper-slide-shadow-'+(u?"right":"bottom")+'"></div>'),f.append(M)),S.length&&(S[0].style.opacity=Math.max(-y,0)),M.length&&(M[0].style.opacity=Math.max(y,0))}}if(i.css({"-webkit-transform-origin":"50% 50% -"+o/2+"px","-moz-transform-origin":"50% 50% -"+o/2+"px","-ms-transform-origin":"50% 50% -"+o/2+"px","transform-origin":"50% 50% -"+o/2+"px"}),p.shadow)if(u)e.transform("translate3d(0px, "+(r/2+p.shadowOffset)+"px, "+-r/2+"px) rotateX(90deg) rotateZ(0deg) scale("+p.shadowScale+")");else{var z=Math.abs(h)-90*Math.floor(Math.abs(h)/90),P=1.5-(Math.sin(2*z*Math.PI/360)/2+Math.cos(2*z*Math.PI/360)/2),k=p.shadowScale,$=p.shadowScale/P,L=p.shadowOffset;e.transform("scale3d("+k+", 1, "+$+") translate3d(0px, "+(n/2+L)+"px, "+-n/2/$+"px) rotateX(-90deg)")}var I=d.isSafari||d.isWebView?-o/2:0;i.transform("translate3d(0px,0,"+I+"px) rotateX("+(t.isHorizontal()?0:h)+"deg) rotateY("+(t.isHorizontal()?-h:0)+"deg)")},setTransition:function(e){var t=this,a=t.$el;t.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),t.params.cubeEffect.shadow&&!t.isHorizontal()&&a.find(".swiper-cube-shadow").transition(e)}},ce={setTranslate:function(){for(var e=this,t=e.slides,a=e.rtlTranslate,i=0;i<t.length;i+=1){var s=t.eq(i),r=s[0].progress;e.params.flipEffect.limitRotation&&(r=Math.max(Math.min(s[0].progress,1),-1));var n=-180*r,l=0,o=-s[0].swiperSlideOffset,d=0;if(e.isHorizontal()?a&&(n=-n):(d=o,o=0,l=-n,n=0),s[0].style.zIndex=-Math.abs(Math.round(r))+t.length,e.params.flipEffect.slideShadows){var p=e.isHorizontal()?s.find(".swiper-slide-shadow-left"):s.find(".swiper-slide-shadow-top"),u=e.isHorizontal()?s.find(".swiper-slide-shadow-right"):s.find(".swiper-slide-shadow-bottom");0===p.length&&(p=m('<div class="swiper-slide-shadow-'+(e.isHorizontal()?"left":"top")+'"></div>'),s.append(p)),0===u.length&&(u=m('<div class="swiper-slide-shadow-'+(e.isHorizontal()?"right":"bottom")+'"></div>'),s.append(u)),p.length&&(p[0].style.opacity=Math.max(-r,0)),u.length&&(u[0].style.opacity=Math.max(r,0))}s.transform("translate3d("+o+"px, "+d+"px, 0px) rotateX("+l+"deg) rotateY("+n+"deg)")}},setTransition:function(e){var t=this,a=t.slides,i=t.activeIndex,s=t.$wrapperEl;if(a.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e),t.params.virtualTranslate&&0!==e){var r=!1;a.eq(i).transitionEnd((function(){if(!r&&t&&!t.destroyed){r=!0,t.animating=!1;for(var e=["webkitTransitionEnd","transitionend"],a=0;a<e.length;a+=1)s.trigger(e[a])}}))}}},he={setTranslate:function(){for(var e=this,t=e.width,a=e.height,i=e.slides,s=e.slidesSizesGrid,r=e.params.coverflowEffect,n=e.isHorizontal(),l=e.translate,o=n?t/2-l:a/2-l,d=n?r.rotate:-r.rotate,p=r.depth,u=0,c=i.length;u<c;u+=1){var h=i.eq(u),v=s[u],f=(o-h[0].swiperSlideOffset-v/2)/v*r.modifier,g=n?d*f:0,b=n?0:d*f,w=-p*Math.abs(f),y=r.stretch;"string"==typeof y&&-1!==y.indexOf("%")&&(y=parseFloat(r.stretch)/100*v);var E=n?0:y*f,x=n?y*f:0,T=1-(1-r.scale)*Math.abs(f);Math.abs(x)<.001&&(x=0),Math.abs(E)<.001&&(E=0),Math.abs(w)<.001&&(w=0),Math.abs(g)<.001&&(g=0),Math.abs(b)<.001&&(b=0),Math.abs(T)<.001&&(T=0);var C="translate3d("+x+"px,"+E+"px,"+w+"px)  rotateX("+b+"deg) rotateY("+g+"deg) scale("+T+")";if(h.transform(C),h[0].style.zIndex=1-Math.abs(Math.round(f)),r.slideShadows){var S=n?h.find(".swiper-slide-shadow-left"):h.find(".swiper-slide-shadow-top"),M=n?h.find(".swiper-slide-shadow-right"):h.find(".swiper-slide-shadow-bottom");0===S.length&&(S=m('<div class="swiper-slide-shadow-'+(n?"left":"top")+'"></div>'),h.append(S)),0===M.length&&(M=m('<div class="swiper-slide-shadow-'+(n?"right":"bottom")+'"></div>'),h.append(M)),S.length&&(S[0].style.opacity=f>0?f:0),M.length&&(M[0].style.opacity=-f>0?-f:0)}}},setTransition:function(e){this.slides.transition(e).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(e)}},ve={init:function(){var e=this,t=e.params.thumbs;if(e.thumbs.initialized)return!1;e.thumbs.initialized=!0;var a=e.constructor;return t.swiper instanceof a?(e.thumbs.swiper=t.swiper,M(e.thumbs.swiper.originalParams,{watchSlidesProgress:!0,slideToClickedSlide:!1}),M(e.thumbs.swiper.params,{watchSlidesProgress:!0,slideToClickedSlide:!1})):C(t.swiper)&&(e.thumbs.swiper=new a(M({},t.swiper,{watchSlidesVisibility:!0,watchSlidesProgress:!0,slideToClickedSlide:!1})),e.thumbs.swiperCreated=!0),e.thumbs.swiper.$el.addClass(e.params.thumbs.thumbsContainerClass),e.thumbs.swiper.on("tap",e.thumbs.onThumbClick),!0},onThumbClick:function(){var e=this,t=e.thumbs.swiper;if(t){var a=t.clickedIndex,i=t.clickedSlide;if(!(i&&m(i).hasClass(e.params.thumbs.slideThumbActiveClass)||null==a)){var s;if(s=t.params.loop?parseInt(m(t.clickedSlide).attr("data-swiper-slide-index"),10):a,e.params.loop){var r=e.activeIndex;e.slides.eq(r).hasClass(e.params.slideDuplicateClass)&&(e.loopFix(),e._clientLeft=e.$wrapperEl[0].clientLeft,r=e.activeIndex);var n=e.slides.eq(r).prevAll('[data-swiper-slide-index="'+s+'"]').eq(0).index(),l=e.slides.eq(r).nextAll('[data-swiper-slide-index="'+s+'"]').eq(0).index();s=void 0===n?l:void 0===l?n:l-r<r-n?l:n}e.slideTo(s)}}},update:function(e){var t=this,a=t.thumbs.swiper;if(a){var i="auto"===a.params.slidesPerView?a.slidesPerViewDynamic():a.params.slidesPerView,s=t.params.thumbs.autoScrollOffset,r=s&&!a.params.loop;if(t.realIndex!==a.realIndex||r){var n,l,o=a.activeIndex;if(a.params.loop){a.slides.eq(o).hasClass(a.params.slideDuplicateClass)&&(a.loopFix(),a._clientLeft=a.$wrapperEl[0].clientLeft,o=a.activeIndex);var d=a.slides.eq(o).prevAll('[data-swiper-slide-index="'+t.realIndex+'"]').eq(0).index(),p=a.slides.eq(o).nextAll('[data-swiper-slide-index="'+t.realIndex+'"]').eq(0).index();n=void 0===d?p:void 0===p?d:p-o==o-d?a.params.slidesPerGroup>1?p:o:p-o<o-d?p:d,l=t.activeIndex>t.previousIndex?"next":"prev"}else l=(n=t.realIndex)>t.previousIndex?"next":"prev";r&&(n+="next"===l?s:-1*s),a.visibleSlidesIndexes&&a.visibleSlidesIndexes.indexOf(n)<0&&(a.params.centeredSlides?n=n>o?n-Math.floor(i/2)+1:n+Math.floor(i/2)-1:n>o&&a.params.slidesPerGroup,a.slideTo(n,e?0:void 0))}var u=1,c=t.params.thumbs.slideThumbActiveClass;if(t.params.slidesPerView>1&&!t.params.centeredSlides&&(u=t.params.slidesPerView),t.params.thumbs.multipleActiveThumbs||(u=1),u=Math.floor(u),a.slides.removeClass(c),a.params.loop||a.params.virtual&&a.params.virtual.enabled)for(var h=0;h<u;h+=1)a.$wrapperEl.children('[data-swiper-slide-index="'+(t.realIndex+h)+'"]').addClass(c);else for(var v=0;v<u;v+=1)a.slides.eq(t.realIndex+v).addClass(c)}}},fe=[U,Z,{name:"mousewheel",params:{mousewheel:{enabled:!1,releaseOnEdges:!1,invert:!1,forceToAxis:!1,sensitivity:1,eventsTarget:"container",thresholdDelta:null,thresholdTime:null}},create:function(){z(this,{mousewheel:{enabled:!1,lastScrollTime:x(),lastEventBeforeSnap:void 0,recentWheelEvents:[],enable:J.enable,disable:J.disable,handle:J.handle,handleMouseEnter:J.handleMouseEnter,handleMouseLeave:J.handleMouseLeave,animateSlider:J.animateSlider,releaseScroll:J.releaseScroll}})},on:{init:function(e){!e.params.mousewheel.enabled&&e.params.cssMode&&e.mousewheel.disable(),e.params.mousewheel.enabled&&e.mousewheel.enable()},destroy:function(e){e.params.cssMode&&e.mousewheel.enable(),e.mousewheel.enabled&&e.mousewheel.disable()}}},{name:"navigation",params:{navigation:{nextEl:null,prevEl:null,hideOnClick:!1,disabledClass:"swiper-button-disabled",hiddenClass:"swiper-button-hidden",lockClass:"swiper-button-lock"}},create:function(){z(this,{navigation:t({},Q)})},on:{init:function(e){e.navigation.init(),e.navigation.update()},toEdge:function(e){e.navigation.update()},fromEdge:function(e){e.navigation.update()},destroy:function(e){e.navigation.destroy()},"enable disable":function(e){var t=e.navigation,a=t.$nextEl,i=t.$prevEl;a&&a[e.enabled?"removeClass":"addClass"](e.params.navigation.lockClass),i&&i[e.enabled?"removeClass":"addClass"](e.params.navigation.lockClass)},click:function(e,t){var a=e.navigation,i=a.$nextEl,s=a.$prevEl,r=t.target;if(e.params.navigation.hideOnClick&&!m(r).is(s)&&!m(r).is(i)){if(e.pagination&&e.params.pagination&&e.params.pagination.clickable&&(e.pagination.el===r||e.pagination.el.contains(r)))return;var n;i?n=i.hasClass(e.params.navigation.hiddenClass):s&&(n=s.hasClass(e.params.navigation.hiddenClass)),!0===n?e.emit("navigationShow"):e.emit("navigationHide"),i&&i.toggleClass(e.params.navigation.hiddenClass),s&&s.toggleClass(e.params.navigation.hiddenClass)}}}},{name:"pagination",params:{pagination:{el:null,bulletElement:"span",clickable:!1,hideOnClick:!1,renderBullet:null,renderProgressbar:null,renderFraction:null,renderCustom:null,progressbarOpposite:!1,type:"bullets",dynamicBullets:!1,dynamicMainBullets:1,formatFractionCurrent:function(e){return e},formatFractionTotal:function(e){return e},bulletClass:"swiper-pagination-bullet",bulletActiveClass:"swiper-pagination-bullet-active",modifierClass:"swiper-pagination-",currentClass:"swiper-pagination-current",totalClass:"swiper-pagination-total",hiddenClass:"swiper-pagination-hidden",progressbarFillClass:"swiper-pagination-progressbar-fill",progressbarOppositeClass:"swiper-pagination-progressbar-opposite",clickableClass:"swiper-pagination-clickable",lockClass:"swiper-pagination-lock"}},create:function(){z(this,{pagination:t({dynamicBulletIndex:0},ee)})},on:{init:function(e){e.pagination.init(),e.pagination.render(),e.pagination.update()},activeIndexChange:function(e){(e.params.loop||void 0===e.snapIndex)&&e.pagination.update()},snapIndexChange:function(e){e.params.loop||e.pagination.update()},slidesLengthChange:function(e){e.params.loop&&(e.pagination.render(),e.pagination.update())},snapGridLengthChange:function(e){e.params.loop||(e.pagination.render(),e.pagination.update())},destroy:function(e){e.pagination.destroy()},"enable disable":function(e){var t=e.pagination.$el;t&&t[e.enabled?"removeClass":"addClass"](e.params.pagination.lockClass)},click:function(e,t){var a=t.target;if(e.params.pagination.el&&e.params.pagination.hideOnClick&&e.pagination.$el.length>0&&!m(a).hasClass(e.params.pagination.bulletClass)){if(e.navigation&&(e.navigation.nextEl&&a===e.navigation.nextEl||e.navigation.prevEl&&a===e.navigation.prevEl))return;!0===e.pagination.$el.hasClass(e.params.pagination.hiddenClass)?e.emit("paginationShow"):e.emit("paginationHide"),e.pagination.$el.toggleClass(e.params.pagination.hiddenClass)}}}},{name:"scrollbar",params:{scrollbar:{el:null,dragSize:"auto",hide:!1,draggable:!1,snapOnRelease:!0,lockClass:"swiper-scrollbar-lock",dragClass:"swiper-scrollbar-drag"}},create:function(){z(this,{scrollbar:t({isTouched:!1,timeout:null,dragTimeout:null},te)})},on:{init:function(e){e.scrollbar.init(),e.scrollbar.updateSize(),e.scrollbar.setTranslate()},update:function(e){e.scrollbar.updateSize()},resize:function(e){e.scrollbar.updateSize()},observerUpdate:function(e){e.scrollbar.updateSize()},setTranslate:function(e){e.scrollbar.setTranslate()},setTransition:function(e,t){e.scrollbar.setTransition(t)},"enable disable":function(e){var t=e.scrollbar.$el;t&&t[e.enabled?"removeClass":"addClass"](e.params.scrollbar.lockClass)},destroy:function(e){e.scrollbar.destroy()}}},{name:"parallax",params:{parallax:{enabled:!1}},create:function(){z(this,{parallax:t({},ae)})},on:{beforeInit:function(e){e.params.parallax.enabled&&(e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)},init:function(e){e.params.parallax.enabled&&e.parallax.setTranslate()},setTranslate:function(e){e.params.parallax.enabled&&e.parallax.setTranslate()},setTransition:function(e,t){e.params.parallax.enabled&&e.parallax.setTransition(t)}}},{name:"zoom",params:{zoom:{enabled:!1,maxRatio:3,minRatio:1,toggle:!0,containerClass:"swiper-zoom-container",zoomedSlideClass:"swiper-slide-zoomed"}},create:function(){var e=this;z(e,{zoom:t({enabled:!1,scale:1,currentScale:1,isScaling:!1,gesture:{$slideEl:void 0,slideWidth:void 0,slideHeight:void 0,$imageEl:void 0,$imageWrapEl:void 0,maxRatio:3},image:{isTouched:void 0,isMoved:void 0,currentX:void 0,currentY:void 0,minX:void 0,minY:void 0,maxX:void 0,maxY:void 0,width:void 0,height:void 0,startX:void 0,startY:void 0,touchesStart:{},touchesCurrent:{}},velocity:{x:void 0,y:void 0,prevPositionX:void 0,prevPositionY:void 0,prevTime:void 0}},ie)});var a=1;Object.defineProperty(e.zoom,"scale",{get:function(){return a},set:function(t){if(a!==t){var i=e.zoom.gesture.$imageEl?e.zoom.gesture.$imageEl[0]:void 0,s=e.zoom.gesture.$slideEl?e.zoom.gesture.$slideEl[0]:void 0;e.emit("zoomChange",t,i,s)}a=t}})},on:{init:function(e){e.params.zoom.enabled&&e.zoom.enable()},destroy:function(e){e.zoom.disable()},touchStart:function(e,t){e.zoom.enabled&&e.zoom.onTouchStart(t)},touchEnd:function(e,t){e.zoom.enabled&&e.zoom.onTouchEnd(t)},doubleTap:function(e,t){!e.animating&&e.params.zoom.enabled&&e.zoom.enabled&&e.params.zoom.toggle&&e.zoom.toggle(t)},transitionEnd:function(e){e.zoom.enabled&&e.params.zoom.enabled&&e.zoom.onTransitionEnd()},slideChange:function(e){e.zoom.enabled&&e.params.zoom.enabled&&e.params.cssMode&&e.zoom.onTransitionEnd()}}},{name:"lazy",params:{lazy:{checkInView:!1,enabled:!1,loadPrevNext:!1,loadPrevNextAmount:1,loadOnTransitionStart:!1,scrollingElement:"",elementClass:"swiper-lazy",loadingClass:"swiper-lazy-loading",loadedClass:"swiper-lazy-loaded",preloaderClass:"swiper-lazy-preloader"}},create:function(){z(this,{lazy:t({initialImageLoaded:!1},se)})},on:{beforeInit:function(e){e.params.lazy.enabled&&e.params.preloadImages&&(e.params.preloadImages=!1)},init:function(e){e.params.lazy.enabled&&!e.params.loop&&0===e.params.initialSlide&&(e.params.lazy.checkInView?e.lazy.checkInViewOnLoad():e.lazy.load())},scroll:function(e){e.params.freeMode&&!e.params.freeModeSticky&&e.lazy.load()},"scrollbarDragMove resize _freeModeNoMomentumRelease":function(e){e.params.lazy.enabled&&e.lazy.load()},transitionStart:function(e){e.params.lazy.enabled&&(e.params.lazy.loadOnTransitionStart||!e.params.lazy.loadOnTransitionStart&&!e.lazy.initialImageLoaded)&&e.lazy.load()},transitionEnd:function(e){e.params.lazy.enabled&&!e.params.lazy.loadOnTransitionStart&&e.lazy.load()},slideChange:function(e){var t=e.params,a=t.lazy,i=t.cssMode,s=t.watchSlidesVisibility,r=t.watchSlidesProgress,n=t.touchReleaseOnEdges,l=t.resistanceRatio;a.enabled&&(i||(s||r)&&(n||0===l))&&e.lazy.load()}}},{name:"controller",params:{controller:{control:void 0,inverse:!1,by:"slide"}},create:function(){z(this,{controller:t({control:this.params.controller.control},re)})},on:{update:function(e){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)},resize:function(e){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)},observerUpdate:function(e){e.controller.control&&e.controller.spline&&(e.controller.spline=void 0,delete e.controller.spline)},setTranslate:function(e,t,a){e.controller.control&&e.controller.setTranslate(t,a)},setTransition:function(e,t,a){e.controller.control&&e.controller.setTransition(t,a)}}},{name:"a11y",params:{a11y:{enabled:!0,notificationClass:"swiper-notification",prevSlideMessage:"Previous slide",nextSlideMessage:"Next slide",firstSlideMessage:"This is the first slide",lastSlideMessage:"This is the last slide",paginationBulletMessage:"Go to slide {{index}}",slideLabelMessage:"{{index}} / {{slidesLength}}",containerMessage:null,containerRoleDescriptionMessage:null,itemRoleDescriptionMessage:null,slideRole:"group"}},create:function(){z(this,{a11y:t({},ne,{liveRegion:m('<span class="'+this.params.a11y.notificationClass+'" aria-live="assertive" aria-atomic="true"></span>')})})},on:{afterInit:function(e){e.params.a11y.enabled&&(e.a11y.init(),e.a11y.updateNavigation())},toEdge:function(e){e.params.a11y.enabled&&e.a11y.updateNavigation()},fromEdge:function(e){e.params.a11y.enabled&&e.a11y.updateNavigation()},paginationUpdate:function(e){e.params.a11y.enabled&&e.a11y.updatePagination()},destroy:function(e){e.params.a11y.enabled&&e.a11y.destroy()}}},{name:"history",params:{history:{enabled:!1,root:"",replaceState:!1,key:"slides"}},create:function(){z(this,{history:t({},le)})},on:{init:function(e){e.params.history.enabled&&e.history.init()},destroy:function(e){e.params.history.enabled&&e.history.destroy()},"transitionEnd _freeModeNoMomentumRelease":function(e){e.history.initialized&&e.history.setHistory(e.params.history.key,e.activeIndex)},slideChange:function(e){e.history.initialized&&e.params.cssMode&&e.history.setHistory(e.params.history.key,e.activeIndex)}}},{name:"hash-navigation",params:{hashNavigation:{enabled:!1,replaceState:!1,watchState:!1}},create:function(){z(this,{hashNavigation:t({initialized:!1},oe)})},on:{init:function(e){e.params.hashNavigation.enabled&&e.hashNavigation.init()},destroy:function(e){e.params.hashNavigation.enabled&&e.hashNavigation.destroy()},"transitionEnd _freeModeNoMomentumRelease":function(e){e.hashNavigation.initialized&&e.hashNavigation.setHash()},slideChange:function(e){e.hashNavigation.initialized&&e.params.cssMode&&e.hashNavigation.setHash()}}},{name:"autoplay",params:{autoplay:{enabled:!1,delay:3e3,waitForTransition:!0,disableOnInteraction:!0,stopOnLastSlide:!1,reverseDirection:!1,pauseOnMouseEnter:!1}},create:function(){z(this,{autoplay:t({},de,{running:!1,paused:!1})})},on:{init:function(e){e.params.autoplay.enabled&&(e.autoplay.start(),r().addEventListener("visibilitychange",e.autoplay.onVisibilityChange),e.autoplay.attachMouseEvents())},beforeTransitionStart:function(e,t,a){e.autoplay.running&&(a||!e.params.autoplay.disableOnInteraction?e.autoplay.pause(t):e.autoplay.stop())},sliderFirstMove:function(e){e.autoplay.running&&(e.params.autoplay.disableOnInteraction?e.autoplay.stop():e.autoplay.pause())},touchEnd:function(e){e.params.cssMode&&e.autoplay.paused&&!e.params.autoplay.disableOnInteraction&&e.autoplay.run()},destroy:function(e){e.autoplay.detachMouseEvents(),e.autoplay.running&&e.autoplay.stop(),r().removeEventListener("visibilitychange",e.autoplay.onVisibilityChange)}}},{name:"effect-fade",params:{fadeEffect:{crossFade:!1}},create:function(){z(this,{fadeEffect:t({},pe)})},on:{beforeInit:function(e){if("fade"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"fade");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};M(e.params,t),M(e.originalParams,t)}},setTranslate:function(e){"fade"===e.params.effect&&e.fadeEffect.setTranslate()},setTransition:function(e,t){"fade"===e.params.effect&&e.fadeEffect.setTransition(t)}}},{name:"effect-cube",params:{cubeEffect:{slideShadows:!0,shadow:!0,shadowOffset:20,shadowScale:.94}},create:function(){z(this,{cubeEffect:t({},ue)})},on:{beforeInit:function(e){if("cube"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"cube"),e.classNames.push(e.params.containerModifierClass+"3d");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,resistanceRatio:0,spaceBetween:0,centeredSlides:!1,virtualTranslate:!0};M(e.params,t),M(e.originalParams,t)}},setTranslate:function(e){"cube"===e.params.effect&&e.cubeEffect.setTranslate()},setTransition:function(e,t){"cube"===e.params.effect&&e.cubeEffect.setTransition(t)}}},{name:"effect-flip",params:{flipEffect:{slideShadows:!0,limitRotation:!0}},create:function(){z(this,{flipEffect:t({},ce)})},on:{beforeInit:function(e){if("flip"===e.params.effect){e.classNames.push(e.params.containerModifierClass+"flip"),e.classNames.push(e.params.containerModifierClass+"3d");var t={slidesPerView:1,slidesPerColumn:1,slidesPerGroup:1,watchSlidesProgress:!0,spaceBetween:0,virtualTranslate:!0};M(e.params,t),M(e.originalParams,t)}},setTranslate:function(e){"flip"===e.params.effect&&e.flipEffect.setTranslate()},setTransition:function(e,t){"flip"===e.params.effect&&e.flipEffect.setTransition(t)}}},{name:"effect-coverflow",params:{coverflowEffect:{rotate:50,stretch:0,depth:100,scale:1,modifier:1,slideShadows:!0}},create:function(){z(this,{coverflowEffect:t({},he)})},on:{beforeInit:function(e){"coverflow"===e.params.effect&&(e.classNames.push(e.params.containerModifierClass+"coverflow"),e.classNames.push(e.params.containerModifierClass+"3d"),e.params.watchSlidesProgress=!0,e.originalParams.watchSlidesProgress=!0)},setTranslate:function(e){"coverflow"===e.params.effect&&e.coverflowEffect.setTranslate()},setTransition:function(e,t){"coverflow"===e.params.effect&&e.coverflowEffect.setTransition(t)}}},{name:"thumbs",params:{thumbs:{swiper:null,multipleActiveThumbs:!0,autoScrollOffset:0,slideThumbActiveClass:"swiper-slide-thumb-active",thumbsContainerClass:"swiper-container-thumbs"}},create:function(){z(this,{thumbs:t({swiper:null,initialized:!1},ve)})},on:{beforeInit:function(e){var t=e.params.thumbs;t&&t.swiper&&(e.thumbs.init(),e.thumbs.update(!0))},slideChange:function(e){e.thumbs.swiper&&e.thumbs.update()},update:function(e){e.thumbs.swiper&&e.thumbs.update()},resize:function(e){e.thumbs.swiper&&e.thumbs.update()},observerUpdate:function(e){e.thumbs.swiper&&e.thumbs.update()},setTransition:function(e,t){var a=e.thumbs.swiper;a&&a.setTransition(t)},beforeDestroy:function(e){var t=e.thumbs.swiper;t&&e.thumbs.swiperCreated&&t&&t.destroy()}}}];return q.use(fe),q})); //# sourceMappingURL=swiper-bundle.min.js.map
/*! ScrollMagic v2.0.7 | (c) 2019 Jan Paepke (@janpaepke) | license & info: http://scrollmagic.io */ !function(e,n){"function"==typeof define&&define.amd?define(["ScrollMagic","TweenMax","TimelineMax"],n):"object"==typeof exports?(require("gsap"),n(require("scrollmagic"),TweenMax,TimelineMax)):n(e.ScrollMagic||e.jQuery&&e.jQuery.ScrollMagic,e.TweenMax||e.TweenLite,e.TimelineMax||e.TimelineLite)}(this,function(e,s,u){"use strict";e.Scene.addOption("tweenChanges",!1,function(e){return!!e}),e.Scene.extend(function(){var i,o=this;o.on("progress.plugin_gsap",function(){a()}),o.on("destroy.plugin_gsap",function(e){o.removeTween(e.reset)});var a=function(){if(i){var e=o.progress(),n=o.state();i.repeat&&-1===i.repeat()?"DURING"===n&&i.paused()?i.play():"DURING"===n||i.paused()||i.pause():e!=i.progress()&&(0===o.duration()?0<e?i.play():i.reverse():o.tweenChanges()&&i.tweenTo?i.tweenTo(e*i.duration()):i.progress(e).pause())}};o.setTween=function(e,n,r){var t;1<arguments.length&&(arguments.length<3&&(r=n,n=1),e=s.to(e,n,r));try{(t=u?new u({smoothChildTiming:!0}).add(e):e).pause()}catch(e){return o}return i&&o.removeTween(),i=t,e.repeat&&-1===e.repeat()&&(i.repeat(-1),i.yoyo(e.yoyo())),a(),o},o.removeTween=function(e){return i&&(e&&i.progress(0).pause(),i.kill(),i=void 0),o}})});

/*! js-cookie v3.0.0-rc.1 | MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self,function(){var n=e.Cookies,r=e.Cookies=t();r.noConflict=function(){return e.Cookies=n,r}}())}(this,function(){"use strict";function e(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)e[r]=n[r]}return e}var t={read:function(e){return e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent)},write:function(e){return encodeURIComponent(e).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,decodeURIComponent)}};return function n(r,o){function i(t,n,i){if("undefined"!=typeof document){"number"==typeof(i=e({},o,i)).expires&&(i.expires=new Date(Date.now()+864e5*i.expires)),i.expires&&(i.expires=i.expires.toUTCString()),t=encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),n=r.write(n,t);var c="";for(var u in i)i[u]&&(c+="; "+u,!0!==i[u]&&(c+="="+i[u].split(";")[0]));return document.cookie=t+"="+n+c}}return Object.create({set:i,get:function(e){if("undefined"!=typeof document&&(!arguments.length||e)){for(var n=document.cookie?document.cookie.split("; "):[],o={},i=0;i<n.length;i++){var c=n[i].split("="),u=c.slice(1).join("=");'"'===u[0]&&(u=u.slice(1,-1));try{var f=t.read(c[0]);if(o[f]=r.read(u,f),e===f)break}catch(e){}}return e?o[e]:o}},remove:function(t,n){i(t,"",e({},n,{expires:-1}))},withAttributes:function(t){return n(this.converter,e({},this.attributes,t))},withConverter:function(t){return n(e({},this.converter,t),this.attributes)}},{attributes:{value:Object.freeze(o)},converter:{value:Object.freeze(r)}})}(t,{path:"/"})});


/* 
         IMPORTANT NOTE:
         
         This file is the unminified JS that is used by the theme. This file is therefore not included into the "theme.liquid" Liquid. It is bundled only
         for developers who would like to add their own JavaScript or edit the existing JavaScript. Re-minifying the ile and make sure you include it into
         the "theme.liquid" is up to the developers responsibility.
         
         Because we are using WebPack internally to bundle our JavaScript code, even the unminified file can be quite hard to read or edit due to all the
         code added by WebPack.
         
         Please note that we do not provide any assistance for changes made here that may break the theme: it's at your own risk :).
      */
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/******/(function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, {
        /******/configurable: false,
        /******/enumerable: true,
        /******/get: getter
        /******/ });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = "";
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = 58);
  /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /**
   * Various DOM helper
   */

  var Dom = function () {
    function Dom() {
      _classCallCheck(this, Dom);
    }

    _createClass(Dom, null, [{
      key: 'getSiblings',

      /**
       * Get all the previous and next siblings, optionally filtered by a selector
       */
      value: function getSiblings(element, filter) {
        var includeSelf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var siblings = [];
        var currentElement = element;

        // Do the previous first
        while (currentElement = currentElement.previousElementSibling) {
          if (!filter || currentElement.matches(filter)) {
            siblings.push(currentElement);
          }
        }

        if (includeSelf) {
          siblings.push(element);
        }

        // Then the next side
        currentElement = element;

        while (currentElement = currentElement.nextElementSibling) {
          if (!filter || currentElement.matches(filter)) {
            siblings.push(currentElement);
          }
        }

        return siblings;
      }

      /**
       * By default, NodeList object are only iterable with forEach on newest browsers. To support it cross-browser,
       * we need to normalize it
       */

    }, {
      key: 'nodeListToArray',
      value: function nodeListToArray(nodeList, filter) {
        var items = [];

        for (var i = 0; i !== nodeList.length; ++i) {
          if (!filter || nodeList[i].matches(filter)) {
            items.push(nodeList[i]);
          }
        }

        return items;
      }

      /**
       * Calculate an element width with its margin
       */

    }, {
      key: 'outerWidthWithMargin',
      value: function outerWidthWithMargin(element) {
        var width = element.offsetWidth,
            style = getComputedStyle(element);

        width += parseInt(style.marginLeft) + parseInt(style.marginRight);

        return width;
      }

      /**
       * Calculate an element height with its margin
       */

    }, {
      key: 'outerHeightWithMargin',
      value: function outerHeightWithMargin(element) {
        var height = element.offsetHeight,
            style = getComputedStyle(element);

        height += parseInt(style.marginTop) + parseInt(style.marginBottom);

        return height;
      }
    }]);

    return Dom;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Dom;

  /***/
},
/* 1 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var Responsive = function () {
    function Responsive() {
      var _this = this;

      _classCallCheck(this, Responsive);

      this.currentBreakpoint = Responsive.getCurrentBreakpoint();

      window.addEventListener('resize', function () {
        var newBreakpoint = Responsive.getCurrentBreakpoint();

        if (_this.currentBreakpoint === newBreakpoint) {
          return;
        }

        document.dispatchEvent(new CustomEvent('breakpoint:changed', { detail: {
            previousBreakpoint: _this.currentBreakpoint,
            currentBreakpoint: newBreakpoint
          } }));

        _this.currentBreakpoint = newBreakpoint;
      });
    }

    _createClass(Responsive, null, [{
      key: 'matchesBreakpoint',
      value: function matchesBreakpoint(breakpoint) {
        switch (breakpoint) {
          case 'phone':
            return window.matchMedia('screen and (max-width: 640px)').matches;

          case 'tablet':
            return window.matchMedia('screen and (min-width: 641px) and (max-width: 1007px)').matches;

          case 'tablet-and-up':
            return window.matchMedia('screen and (min-width: 641px)').matches;

          case 'pocket':
            return window.matchMedia('screen and (max-width: 1007px)').matches;

          case 'lap':
            return window.matchMedia('screen and (min-width: 1008px) and (max-width: 1279px)').matches;

          case 'lap-and-up':
            return window.matchMedia('screen and (min-width: 1008px)').matches;

          case 'desk':
            return window.matchMedia('screen and (min-width: 1280px)').matches;

          case 'widescreen':
            return window.matchMedia('screen and (min-width: 1600px)').matches;

          case 'supports-hover':
            return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        }
      }
    }, {
      key: 'getCurrentBreakpoint',
      value: function getCurrentBreakpoint() {
        if (window.matchMedia('screen and (max-width: 640px)').matches) {
          return 'phone';
        }

        if (window.matchMedia('screen and (min-width: 641px) and (max-width: 1007px)').matches) {
          return 'tablet';
        }

        if (window.matchMedia('screen and (min-width: 1008px) and (max-width: 1279px)').matches) {
          return 'lap';
        }

        if (window.matchMedia('screen and (min-width: 1280px)').matches) {
          return 'desk';
        }
      }
    }]);

    return Responsive;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Responsive;

  /***/
},
/* 2 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Responsive__ = __webpack_require__(1);

  var Carousel = function () {
    function Carousel(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var overrideSettings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, Carousel);

      this.element = element;
      this.initialConfig = Object.assign(JSON.parse(element.getAttribute('data-flickity-config')), overrideSettings);
      this.options = options;

      this._attachListeners();
      this._build();
    }

    _createClass(Carousel, [{
      key: 'destroy',
      value: function destroy() {
        this.flickityInstance.destroy();

        if (this.initialConfig['breakpoints'] !== undefined) {
          document.removeEventListener('breakpoint:changed', this._onBreakpointChangedListener);
        }
      }
    }, {
      key: 'getFlickityInstance',
      value: function getFlickityInstance() {
        return this.flickityInstance;
      }
    }, {
      key: 'selectCell',
      value: function selectCell(index) {
        var shouldPause = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var shouldAnimate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        if (shouldPause) {
          this.flickityInstance.pausePlayer();
        }

        this.flickityInstance.select(index, false, !shouldAnimate);
      }
    }, {
      key: 'next',
      value: function next() {
        this.flickityInstance.next();
      }
    }, {
      key: 'previous',
      value: function previous() {
        this.flickityInstance.previous();
      }
    }, {
      key: 'pausePlayer',
      value: function pausePlayer() {
        this.flickityInstance.pausePlayer();
      }
    }, {
      key: 'unpausePlayer',
      value: function unpausePlayer() {
        this.flickityInstance.unpausePlayer();
      }
    }, {
      key: 'resize',
      value: function resize() {
        this.flickityInstance.resize();
      }
    }, {
      key: 'getSelectedIndex',
      value: function getSelectedIndex() {
        return this.flickityInstance.selectedIndex;
      }
    }, {
      key: 'getSelectedCell',
      value: function getSelectedCell() {
        return this.flickityInstance.selectedCell.element;
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        if (this.initialConfig['breakpoints'] !== undefined) {
          this._onBreakpointChangedListener = this._onBreakpointChanged.bind(this);
          document.addEventListener('breakpoint:changed', this._onBreakpointChangedListener);
        }
      }

      /**
       * Create the carousel instance
       */

    }, {
      key: '_build',
      value: function _build() {
        var _this2 = this;

        var config = this._processConfig();

        this.flickityInstance = new Flickity(this.element, config);
        this._validateDraggable();

        this.selectedIndex = this.flickityInstance.selectedIndex;

        this.flickityInstance.on('resize', this._validateDraggable.bind(this));

        if (this.options['onSelect']) {
          this.flickityInstance.on('select', function () {
            // Flickity will send the "select" event whenever the window resize (even on mobile...), as a consequence we need to check
            // first if the slide index have changed or not (cf: https://github.com/metafizzy/flickity/issues/529)

            if (_this2.selectedIndex !== _this2.flickityInstance.selectedIndex) {
              _this2.options['onSelect'](_this2.flickityInstance.selectedIndex, _this2.flickityInstance.selectedCell.element);
              _this2.selectedIndex = _this2.flickityInstance.selectedIndex;
            }
          });
        }

        if (this.options['onSettle']) {
          this.flickityInstance.on('settle', function (index) {
            _this2.options['onSettle'](index, _this2.flickityInstance.selectedCell.element);
          });
        }

        if (this.options['onClick']) {
          this.flickityInstance.on('staticClick', function (event, pointer, cell, index) {
            _this2.options['onClick'](cell, index);
          });
        }
      }

      /**
       * By default, Flickity does not disable draggable automatically if there is nothing to slide. We therefore manually do the check here by checking
       * if the displayed elements equals to the amount of elements
       */

    }, {
      key: '_validateDraggable',
      value: function _validateDraggable() {
        var isActive = this.flickityInstance.isActive || false;

        if (!isActive || !this.flickityInstance.options['draggable']) {
          return; // Not draggable, so nothing to do
        }

        if (undefined === this.flickityInstance.selectedElements || this.flickityInstance.selectedElements.length === this.flickityInstance.cells.length) {
          this.flickityInstance.unbindDrag();
        } else {
          this.flickityInstance.bindDrag();
        }
      }

      /**
       * Flickity is a CSS driven library and hence it is hard to setup some stuff in pure JS
       */

    }, {
      key: '_processConfig',
      value: function _processConfig() {
        var config = Object.assign({}, this.initialConfig);

        delete config['breakpoints'];

        if (this.initialConfig['breakpoints'] === undefined) {
          return config; // No change, we simply return the config as it is
        }

        var breakpoints = this.initialConfig['breakpoints'];

        breakpoints.forEach(function (breakpoint) {
          if (__WEBPACK_IMPORTED_MODULE_0__helper_Responsive__["default"].matchesBreakpoint(breakpoint['matches'])) {
            config = Object.assign(config, breakpoint['settings']);
          }
        });

        return config;
      }

      /**
       * Verify if the breakpoint has changed, and optionally update the carousel
       */

    }, {
      key: '_onBreakpointChanged',
      value: function _onBreakpointChanged() {
        // The breakpoint may have changed, so we delete the carousel and rebuild it
        this.flickityInstance.destroy();
        this._build();
      }
    }]);

    return Carousel;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Carousel;

  /***/
},
/* 3 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Responsive__ = __webpack_require__(1);

  var Popover = function () {
    function Popover(element, options) {
      _classCallCheck(this, Popover);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);

      this.activator = options['activator'] || document.querySelector('[aria-controls="' + element.getAttribute('id') + '"]');

      this.preferredPosition = options['preferredPosition'] || 'bottom';
      this.preferredAlignment = options['preferredAlignment'] || undefined;
      this.threshold = options['threshold'] || 20;
      this.isOpen = false;

      this.onValueChanged = options['onValueChanged'] || function () {};
      this.onOpen = options['onOpen'] || function () {};
      this.onClose = options['onClose'] || function () {};

      this.showOverlay = options['showOverlay'] === undefined ? true : options['showOverlay'];
      this.pageOverlayElement = document.querySelector('.PageOverlay');

      this._attachListeners();
    }

    _createClass(Popover, [{
      key: 'destroy',
      value: function destroy() {
        this.element.removeEventListener('keyup', this._handleKeyboardListener);
        this.delegateElement.off('click');
        this.activator.removeEventListener('click', this._toggleListener);
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.isOpen ? this.close() : this.open();
      }
    }, {
      key: 'open',
      value: function open() {
        var _this3 = this;

        // Note: the additional check on the aria-controls is used here so that a given activator can be used on different
        //       popovers and be modified dynamically in JavaScript
        if (this.isOpen || this.activator.getAttribute('aria-controls') !== this.element.id) {
          return;
        }

        this.element.setAttribute('aria-hidden', 'false');
        this.activator.setAttribute('aria-expanded', 'true');

        disableBodyScroll(true, '[data-scrollable]');

        document.documentElement.classList.add('no-scroll'); // Prevent scrolling when popover is open

        if (__WEBPACK_IMPORTED_MODULE_1__helper_Responsive__["default"].matchesBreakpoint('lap-and-up')) {
          document.body.addEventListener('click', this._clickOutsideListener);
          this._position();
        } else {
          this.element.removeAttribute('style');

          if (this.showOverlay) {
            this.pageOverlayElement.classList.add('is-visible');
            this.pageOverlayElement.addEventListener('click', this._closeListener);
          }
        }

        this.element.setAttribute('tabindex', '-1');

        this.element.addEventListener('transitionend', function () {
          _this3.element.focus();
        }, { once: true });

        this.onOpen(this); // Call the callback to allow other code to hook their logic
        this.isOpen = true;
      }
    }, {
      key: 'close',
      value: function close() {
        if (!this.isOpen) {
          return;
        }

        this.element.setAttribute('aria-hidden', 'true');
        this.activator.setAttribute('aria-expanded', 'false');

        disableBodyScroll(false, '[data-scrollable]');

        document.documentElement.classList.remove('no-scroll');

        if (__WEBPACK_IMPORTED_MODULE_1__helper_Responsive__["default"].matchesBreakpoint('lap-and-up')) {
          document.body.removeEventListener('click', this._clickOutsideListener);
        } else if (this.showOverlay) {
          this.pageOverlayElement.classList.remove('is-visible');
          this.pageOverlayElement.removeEventListener('click', this._closeListener);
        }

        this.element.removeAttribute('tabindex');
        this.activator.focus();

        this.onClose(this); // Call the callback to allow other code to hook their logic
        this.isOpen = false;
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._handleKeyboardListener = this._handleKeyboard.bind(this);
        this._clickOutsideListener = this._clickOutside.bind(this);
        this._closeListener = this.close.bind(this);
        this._toggleListener = this.toggle.bind(this);

        this.element.addEventListener('keyup', this._handleKeyboardListener);
        this.activator.addEventListener('click', this._toggleListener);

        this.delegateElement.on('click', '[data-action="close-popover"]', this.close.bind(this));
        this.delegateElement.on('click', '[data-action="select-value"]', this._valueChanged.bind(this));

        if (this.element.hasAttribute('id')) {
          this.delegateElement.on('focusout', '#' + this.element.getAttribute('id'), this._onFocusOut.bind(this));
        }
      }

      /**
       * Whenever a value is selected, it can notify a callback so that the calling code can do its own logic in response
       * of the value change
       */

    }, {
      key: '_valueChanged',
      value: function _valueChanged(event) {
        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].getSiblings(event.target, '.is-selected').forEach(function (item) {
          return item.classList.remove('is-selected');
        });
        event.target.classList.add('is-selected');

        // If there is a callback in option we call it with the value
        this.onValueChanged(event.target.getAttribute('data-value'), event.target, this.activator);
        this.close();
      }
    }, {
      key: '_onFocusOut',
      value: function _onFocusOut(event) {
        if (!this.element.contains(event.relatedTarget)) {
          this.close();
        }
      }

      /**
       * Callback that is called to decide if we should close the popover when a click is captured outside
       */

    }, {
      key: '_clickOutside',
      value: function _clickOutside(event) {
        if (!event.target.closest('.Popover') && !event.target.closest('.Modal') && event.target !== this.activator && !this.activator.contains(event.target)) {
          this.close();
        }
      }

      /**
       * On desktop, we reposition the popover in JavaScript by doing some smart logic to detect the most appropriate area
       */

    }, {
      key: '_position',
      value: function _position() {
        var _this4 = this;

        var topPosition = 0,
            rightPosition = 0,
            position = '',
            alignment = '',
            threshold = this.threshold;

        fastdom.measure(function () {
          var windowHeight = window.innerHeight,
              activatorBoundingRect = _this4.activator.getBoundingClientRect(),
              halfHeight = windowHeight / 2;

          if (_this4.preferredPosition === 'bottom') {
            alignment = 'right';

            if (_this4.element.clientHeight <= windowHeight - (activatorBoundingRect.bottom + threshold) || windowHeight - activatorBoundingRect.bottom >= halfHeight) {
              position = 'bottom';
            } else {
              position = 'top';
            }
          } else if (_this4.preferredPosition === 'top') {
            alignment = 'right';

            if (_this4.element.clientHeight <= activatorBoundingRect.top - threshold || activatorBoundingRect.top >= halfHeight) {
              position = 'top';
            } else {
              position = 'bottom';
            }
          } else {
            position = 'left';

            // Is there enough space to use the center alignment (which is preferred)?
            var halfElementHeight = _this4.element.clientHeight / 2;

            if (activatorBoundingRect.top >= halfElementHeight && windowHeight - activatorBoundingRect.bottom >= halfElementHeight) {
              alignment = 'center';
            } else if (windowHeight - activatorBoundingRect.bottom >= halfElementHeight) {
              alignment = 'bottom';
            } else {
              alignment = 'top';
            }
          }

          if (_this4.preferredAlignment) {
            alignment = _this4.preferredAlignment;
          }

          if (position === 'top') {
            topPosition = activatorBoundingRect.top - _this4.element.clientHeight - threshold;

            if (alignment === 'center') {
              rightPosition = window.innerWidth - activatorBoundingRect.right - _this4.element.clientWidth / 2 + 3;
            } else {
              rightPosition = window.innerWidth - activatorBoundingRect.right;
            }
          } else if (position === 'bottom') {
            topPosition = activatorBoundingRect.bottom + threshold;

            if (alignment === 'center') {
              rightPosition = window.innerWidth - activatorBoundingRect.right - _this4.element.clientWidth / 2 + 3;
            } else {
              rightPosition = window.innerWidth - activatorBoundingRect.right;
            }
          } else {
            rightPosition = window.innerWidth - activatorBoundingRect.left + threshold;

            if (alignment === 'center') {
              topPosition = activatorBoundingRect.top - _this4.element.clientHeight / 2 + _this4.activator.clientHeight / 2;
            } else if (alignment === 'top') {
              topPosition = activatorBoundingRect.bottom - _this4.element.clientHeight;
            } else {
              topPosition = activatorBoundingRect.top;
            }
          }
        });

        fastdom.mutate(function () {
          ['Popover--positionBottom', 'Popover--positionTop', 'Popover--positionCenter', 'Popover--alignTop', 'Popover--alignCenter', 'Popover--alignBottom'].map(function (item) {
            return _this4.element.classList.remove(item);
          });
          _this4.element.classList.add('Popover--position' + (position.charAt(0).toUpperCase() + position.slice(1)));
          _this4.element.classList.add('Popover--align' + (alignment.charAt(0).toUpperCase() + alignment.slice(1)));

          _this4.element.setAttribute('style', 'top: ' + parseInt(topPosition) + 'px; right: ' + parseInt(rightPosition) + 'px;');
        });
      }

      /**
       * Handle a11y events
       */

    }, {
      key: '_handleKeyboard',
      value: function _handleKeyboard(event) {
        if (this.isOpen && event.keyCode === 27) {
          this.close();
        }
      }
    }]);

    return Popover;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Popover;

  /***/
},
/* 4 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /**
   * Note: this was a feature that was added at the very end and couldn't do something much cleaner without rewriting large parts of the theme...
   */

  var ProductItemColorSwatch = function () {
    function ProductItemColorSwatch(element) {
      _classCallCheck(this, ProductItemColorSwatch);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);

      this.delegateElement.on('change', '.ColorSwatch__Radio', this._colorChanged.bind(this));
    }

    _createClass(ProductItemColorSwatch, [{
      key: '_colorChanged',
      value: function _colorChanged(event, target) {
        // We need to change the URL of the various links
        var productItem = target.closest('.ProductItem'),
            variantUrl = target.getAttribute('data-variant-url');

        productItem.querySelector('.ProductItem__ImageWrapper').setAttribute('href', variantUrl);
        productItem.querySelector('.ProductItem__Title > a').setAttribute('href', variantUrl);

        // If we have a custom image for the variant, we change it
        var originalImageElement = productItem.querySelector('.ProductItem__Image:not(.ProductItem__Image--alternate)');

        if (target.hasAttribute('data-image-url') && target.getAttribute('data-image-id') !== originalImageElement.getAttribute('data-image-id')) {
          var newImageElement = document.createElement('img');
          newImageElement.className = 'ProductItem__Image Image--fadeIn Image--lazyLoad';
          newImageElement.setAttribute('data-image-id', target.getAttribute('data-image-id'));
          newImageElement.setAttribute('data-src', target.getAttribute('data-image-url'));
          newImageElement.setAttribute('data-widths', target.getAttribute('data-image-widths'));
          newImageElement.setAttribute('data-sizes', 'auto');

          // Replace the original node
          if (window.theme.productImageSize === 'natural') {
            originalImageElement.parentNode.style.paddingBottom = 100.0 / target.getAttribute('data-image-aspect-ratio') + '%';
          }

          originalImageElement.parentNode.style.setProperty('--aspect-ratio', target.getAttribute('data-image-aspect-ratio'));
          originalImageElement.parentNode.replaceChild(newImageElement, originalImageElement);
        }
      }
    }]);

    return ProductItemColorSwatch;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductItemColorSwatch;

  /***/
},
/* 5 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var Accessibility = function () {
    function Accessibility() {
      _classCallCheck(this, Accessibility);
    }

    _createClass(Accessibility, null, [{
      key: 'trapFocus',

      /**
       * Traps the focus in a particular container
       */
      value: function trapFocus(container, namespace) {
        this.listeners = this.listeners || {};

        // We check if there is an element with the attribute "autofocus"
        var elementToFocus = container.querySelector('[autofocus]') || container;

        container.setAttribute('tabindex', '-1');
        elementToFocus.focus();

        this.listeners[namespace] = function (event) {
          if (container !== event.target && !container.contains(event.target)) {
            container.focus();
          }
        };

        document.addEventListener('focusin', this.listeners[namespace]);
      }

      /**
       * Removes the trap of focus in a particular container
       */

    }, {
      key: 'removeTrapFocus',
      value: function removeTrapFocus(container, namespace) {
        if (container) {
          container.removeAttribute('tabindex');
        }

        if (this.listeners && this.listeners[namespace]) {
          document.removeEventListener('focusin', this.listeners[namespace]);
        }
      }

      /**
       * Reset any previous trap focus
       */

    }, {
      key: 'clearTrapFocus',
      value: function clearTrapFocus() {
        for (var key in this.listeners) {
          if (this.listeners.hasOwnProperty(key)) {
            document.removeEventListener('focusin', this.listeners[key]);
          }
        }

        this.listeners = {};
      }
    }]);

    return Accessibility;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Accessibility;

  /***/
},
/* 6 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__ = __webpack_require__(5);

  var Drawer = function () {
    function Drawer(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Drawer);

      
      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.delegateBody = new domDelegate.Delegate(document.body);

      this.onOpen = options['onOpen'] || function () {};
      this.onClose = options['onClose'] || function () {};

      this.isOpen = false;
      this.direction = this.element.classList.contains('Drawer--fromLeft') ? 'fromLeft' : 'fromRight';

      this.pageOverlayElement = document.querySelector('.PageOverlay');

      this._attachListeners();
    }

    _createClass(Drawer, [{
      key: 'destroy',
      value: function destroy() {
        this.delegateBody.off('click', '[data-action="open-drawer"][data-drawer-id="' + this.element.id + '"]');
        this.delegateBody.off('click', '[data-action="close-drawer"][data-drawer-id="' + this.element.id + '"]');
        window.removeEventListener('resize', this._calculateMaxHeightListener);
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.isOpen ? this.close() : this.open();
      }
    }, {
      key: 'open',
      value: function open(event) {
        if (this.isOpen) {
          return;
        }

        this.element.querySelector(".Drawer__Content").scrollTop = 0;
        
        // Make sure that the search is closed whenever a drawer is opened
        this.element.dispatchEvent(new CustomEvent('search:close', { bubbles: true }));

        if (event) {
          event.preventDefault();
        }

        this.element.setAttribute('aria-hidden', 'false');
        this._calculateMaxHeight();

        document.documentElement.classList.add('no-scroll');

        // This prevent the body to scroll on iOS. This is honestly a bit hacky, but until the platform supports "touch-action: none" like
        // other browsers, this is the only way to achieve that
        disableBodyScroll(true, '[data-scrollable]');
        __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].trapFocus(this.element, 'drawer');

        document.querySelector('.shopify-section--header').style.zIndex = ''; // Ugly hack

        // We attach an event to the page overlay to close it
        this.pageOverlayElement.classList.add('is-visible');
        this.pageOverlayElement.addEventListener('click', this._closeListener);

        this.isOpen = true;

        this.onOpen(); // Call the callback to allow other code to hook their logic

        return false;
      }
    }, {
      key: 'close',
      value: function close(event) {
        if (!this.isOpen) {
          return;
        }

        if (event) {
          event.preventDefault();
        }

        this.element.setAttribute('aria-hidden', 'true');

        document.documentElement.classList.remove('no-scroll');

        disableBodyScroll(false, '[data-scrollable]');
        __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].removeTrapFocus(this.element, 'drawer');

        this.pageOverlayElement.classList.remove('is-visible');
        this.pageOverlayElement.removeEventListener('click', this._closeListener);

        this.isOpen = false;

        this.onClose(); // Call the callback to allow other code to hook their logic
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._openListener = this.open.bind(this);
        this._closeListener = this.close.bind(this);
        this._calculateMaxHeightListener = this._calculateMaxHeight.bind(this);

        this.delegateBody.on('click', '[data-action="open-drawer"][data-drawer-id="' + this.element.id + '"]', this._openListener);
        this.delegateBody.on('click', '[data-action="close-drawer"][data-drawer-id="' + this.element.id + '"]', this._closeListener);
        this.element.addEventListener('keyup', this._handleKeyboard.bind(this));
        window.addEventListener('resize', this._calculateMaxHeightListener);
      }

      /**
       * Make sure that we force a max-height so that the drawer always stays on screen
       */

    }, {
      key: '_calculateMaxHeight',
      value: function _calculateMaxHeight() {
        this.element.style.maxHeight = window.innerHeight + 'px';
      }
    }, {
      key: '_handleKeyboard',


      /**
       * Handle a11y events
       */
      value: function _handleKeyboard(event) {
        if (this.isOpen && event.keyCode === 27) {
          this.close();
        }
      }
    }]);

    return Drawer;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Drawer;

  /***/
},
/* 7 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var Animation = function () {
    function Animation() {
      _classCallCheck(this, Animation);
    }

    _createClass(Animation, null, [{
      key: 'slideUp',

      /**
       * Slide up aims to close an element. To do that, we take the height of the element, and set it to 0 to
       * force an animation
       */
      value: function slideUp(element) {
        element.style.height = element.scrollHeight + 'px'; // Force previous height to allow CSS transition
        element.offsetHeight; // Force redraw
        element.style.height = 0;
      }

      /**
       * Slide down aims to open an element. To do that, you must make sure that the element you are trying to open
       * is set with height: 0; overflow: hidden in the CSS, and does not contain any padding nor margin.
       */

    }, {
      key: 'slideDown',
      value: function slideDown(element) {
        if (element.style.height === 'auto') {
          return;
        }

        // To do the animation we temporarily hide it, check the height, and transition to it
        element.style.height = element.firstElementChild.scrollHeight + 'px';

        var transitionEnded = function transitionEnded(event) {
          if (event.propertyName === 'height') {
            element.style.height = 'auto'; // Allows the content to grow normally
            element.removeEventListener('transitionend', transitionEnded);
          }
        };

        element.addEventListener('transitionend', transitionEnded);
      }
    }]);

    return Animation;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Animation;

  /***/
},
/* 8 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var Currency = function () {
    function Currency() {
      _classCallCheck(this, Currency);
    }

    _createClass(Currency, null, [{
      key: 'formatMoney',

      /**
       * Format money values based on your shop currency settings
       *
       * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents or 3.00 dollars
       * @param  {String} format - shop money_format setting
       * @return {String} value - formatted value
       */
      value: function formatMoney(cents, format) {
        if (typeof cents === 'string') {
          cents = cents.replace('.', '');
        }

        var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = format || '${{amount}}';

        function defaultTo(value, defaultValue) {
          return value == null || value !== value ? defaultValue : value;
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
          precision = defaultTo(precision, 2);
          thousands = defaultTo(thousands, ',');
          decimal = defaultTo(decimal, '.');

          if (isNaN(number) || number == null) {
            return 0;
          }

          number = (number / 100.0).toFixed(precision);

          var parts = number.split('.'),
              dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
              centsAmount = parts[1] ? decimal + parts[1] : '';

          return dollarsAmount + centsAmount;
        }

        var value = '';

        switch (formatString.match(placeholderRegex)[1]) {
          case 'amount':
            value = formatWithDelimiters(cents, 2);
            break;
          case 'amount_no_decimals':
            value = formatWithDelimiters(cents, 0);
            break;
          case 'amount_with_space_separator':
            value = formatWithDelimiters(cents, 2, ' ', '.');
            break;
          case 'amount_no_decimals_with_comma_separator':
            value = formatWithDelimiters(cents, 0, ',', '.');
            break;
          case 'amount_no_decimals_with_space_separator':
            value = formatWithDelimiters(cents, 0, ' ');
            break;
          case 'amount_with_comma_separator':
            value = formatWithDelimiters(cents, 2, '.', ',');
            break;
        }

        if (formatString.indexOf('with_comma_separator') !== -1) {
          return formatString.replace(placeholderRegex, value).replace(',00', '');
        } else {
          return formatString.replace(placeholderRegex, value).replace('.00', '');
        }
      }
    }]);

    return Currency;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Currency;

  /***/
},
/* 9 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var Image = function () {
    function Image() {
      _classCallCheck(this, Image);
    }

    _createClass(Image, null, [{
      key: 'getSizedImageUrl',

      /**
       * Create a CDN URL (similar to the img_url filter in Liquid)
       */
      value: function getSizedImageUrl(src, size) {
        if (size === null) {
          return src;
        }

        if (size === 'master') {
          return src.replace(/http(s)?:/, '');
        }

        var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

        if (match) {
          var prefix = src.split(match[0]);
          var suffix = match[0];

          return (prefix[0] + '_' + size + suffix).replace(/http(s)?:/, '');
        } else {
          return null;
        }
      }

      /**
       * From a given set of desired sizes and a given image, filter out any unwanted sizes
       */

    }, {
      key: 'getSupportedSizes',
      value: function getSupportedSizes(image, desiredSizes) {
        var supportedSizes = [],
            imageWidth = image['width'];

        desiredSizes.forEach(function (width) {
          if (imageWidth >= width) {
            supportedSizes.push(width);
          }
        });

        return supportedSizes;
      }
    }]);

    return Image;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Image;

  /***/
},
/* 10 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__Accessibility__ = __webpack_require__(5);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "AccessibilityHelper", function () {
    return __WEBPACK_IMPORTED_MODULE_0__Accessibility__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__Animation__ = __webpack_require__(7);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "AnimationHelper", function () {
    return __WEBPACK_IMPORTED_MODULE_1__Animation__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__Currency__ = __webpack_require__(8);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "CurrencyHelper", function () {
    return __WEBPACK_IMPORTED_MODULE_2__Currency__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__Dom__ = __webpack_require__(0);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "DomHelper", function () {
    return __WEBPACK_IMPORTED_MODULE_3__Dom__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__Image__ = __webpack_require__(9);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ImageHelper", function () {
    return __WEBPACK_IMPORTED_MODULE_4__Image__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__Responsive__ = __webpack_require__(1);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ResponsiveHelper", function () {
    return __WEBPACK_IMPORTED_MODULE_5__Responsive__["default"];
  });

  /***/
},
/* 11 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Popover__ = __webpack_require__(3);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__helper_Form__ = __webpack_require__(22);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__components_VariantSelector__ = __webpack_require__(17);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__helper_Currency__ = __webpack_require__(8);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__components_StoreAvailability__ = __webpack_require__(27);
  /**
   * This component handles all the logic of switching variant, updating product meta...
   */

  var ProductVariants = function () {
    function ProductVariants(container, options) {
      var _this5 = this;

      _classCallCheck(this, ProductVariants);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.options = options;

      var jsonData = JSON.parse(this.element.querySelector('[data-product-json]').innerHTML);

      this.productData = jsonData['product'];
      this.variantsInventories = jsonData['inventories'] || {};
      this.masterSelector = this.element.querySelector('#product-select-' + this.productData['id']);

      // We init value with the first selected variant
      this.productData['variants'].forEach(function (variant) {
        if (variant['id'] === jsonData['selected_variant_id']) {
          _this5.currentVariant = variant;
          _this5.option1 = variant['option1'];
          _this5.option2 = variant['option2'];
          _this5.option3 = variant['option3'];
        }
      });

      this.storeAvailability = new __WEBPACK_IMPORTED_MODULE_5__components_StoreAvailability__["default"](this.element.querySelector('.ProductMeta__StoreAvailabilityContainer'), this.productData['title']);
      this.storeAvailability.updateWithVariant(this.currentVariant);

      this._attachListeners();
      this._createSelectors();
    }

    _createClass(ProductVariants, [{
      key: 'destroy',
      value: function destroy() {
        this.delegateElement.off('click');
        this.formPopovers.forEach(function (popover) {
          return popover.destroy();
        });
        this.formVariantSelectors.forEach(function (selector) {
          return selector.destroy();
        });
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '[data-action="add-to-cart"]', this._addToCart.bind(this));
        this.delegateElement.on('click', '[data-action="decrease-quantity"]', this._decreaseQuantity.bind(this));
        this.delegateElement.on('click', '[data-action="increase-quantity"]', this._increaseQuantity.bind(this));
        this.delegateElement.on('change', '[name="quantity"]', this._validateQuantity.bind(this));

        // Hook when a radio button change
        this.delegateElement.on('change', '.ProductForm__Option [type="radio"]', this._onOptionChanged.bind(this));
      }

      /**
       * Selectors can either be popovers or dedicated variant selectors. We therefore pre-create them all here
       */

    }, {
      key: '_createSelectors',
      value: function _createSelectors() {
        var _this6 = this;

        // Create the instances for each selector
        this.formPopovers = [];
        this.formVariantSelectors = [];

        __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.OptionSelector')).forEach(function (item) {
          var popover = new __WEBPACK_IMPORTED_MODULE_0__components_Popover__["default"](item, { preferredPosition: 'left', onValueChanged: _this6._onOptionChanged.bind(_this6) });
          _this6.formPopovers.push(popover);
        });

        __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.VariantSelector')).forEach(function (item) {
          var variantSelector = new __WEBPACK_IMPORTED_MODULE_3__components_VariantSelector__["default"](item, _this6, { onValueChanged: _this6._onOptionChanged.bind(_this6) });
          _this6.formVariantSelectors.push(variantSelector);
        });
      }

      /**
       * ---------------------------------------------------------------------------------------------------
       * CODE THAT HANDLE VARIANT CHANGES IN THE FRONT
       *
       * Please note that this code is highly dependant on the markup and classes, so make sure to NOT
       * edit this code
       * ---------------------------------------------------------------------------------------------------
       */

      /**
       * This callback is called whenever the variant changes and allows to update data about the active variant
       */

    }, {
      key: '_onVariantChanged',
      value: function _onVariantChanged(previousVariant, newVariant) {

        document.querySelector(".ProductForm__AddToCart--variant").classList.add("hide");
        
        // 1st: the prices
        this._updateProductPrices(newVariant, previousVariant);

        // 2nd: update inventory
        this._updateInventory(newVariant, previousVariant);

        // 3rd: update SKU
        this._updateSku(newVariant, previousVariant);

        // 4th: update the price measurement
        this._updateUnitPrice(newVariant, previousVariant);

        // 5th: the add to cart button
        this._updateAddToCartButton(newVariant, previousVariant);

        // 6th: store availability
        this.storeAvailability.updateWithVariant(newVariant);

        // Finally, we send an event so that other system could hook and do their own logic
        this.element.dispatchEvent(new CustomEvent('variant:changed', {
          bubbles: true,
          detail: { variant: newVariant, previousVariant: previousVariant }
        }));
      }

      /**
       * Update the prices (optionally showing compare at price)
       */

    }, {
      key: '_updateProductPrices',
      value: function _updateProductPrices(newVariant, previousVariant) {
        var productMetaPrices = this.element.querySelector('.ProductMeta__PriceList');

        if (!newVariant) {
          productMetaPrices.style.display = 'none';
        } else {
          if (previousVariant && previousVariant['price'] === newVariant['price'] && previousVariant['compare_at_price'] === newVariant['compare_at_price']) {
            return; // The price do not have changed so let's return to avoid changing the DOM for nothing
          }

          productMetaPrices.innerHTML = '';

          if (newVariant['compare_at_price'] > newVariant['price']) {
            productMetaPrices.innerHTML += '<span class="ProductMeta__Price Price Price--highlight Text--subdued u-h4" data-money-convertible>' + __WEBPACK_IMPORTED_MODULE_4__helper_Currency__["default"].formatMoney(newVariant['price'], window.theme.moneyFormat) + '</span>';
            productMetaPrices.innerHTML += '<span class="ProductMeta__Price Price Price--compareAt Text--subdued u-h4" data-money-convertible>' + __WEBPACK_IMPORTED_MODULE_4__helper_Currency__["default"].formatMoney(newVariant['compare_at_price'], window.theme.moneyFormat) + '</span>';
          } else {
            productMetaPrices.innerHTML += '<span class="ProductMeta__Price Price Text--subdued u-h4" data-money-convertible>' + __WEBPACK_IMPORTED_MODULE_4__helper_Currency__["default"].formatMoney(newVariant['price'], window.theme.moneyFormat) + '</span>';
          }

          productMetaPrices.style.display = '';
        }
      }

      /**
       * Update the inventory (if needed)
       */

    }, {
      key: '_updateInventory',
      value: function _updateInventory(newVariant) {
        if (!this.options['showInventoryQuantity']) {
          return;
        }

        var productFormInventory = this.element.querySelector('.ProductForm__Inventory'),
            variantInventory = newVariant ? this.variantsInventories[newVariant['id']] : null;


        if(productFormInventory.classList.contains("preorder--wrapper")) {
          productFormInventory.innerHTML = productFormInventory.dataset.text.replace("[qty]", variantInventory['inventory_quantity']);
          return;
        }
        
        if (!newVariant || null === variantInventory['inventory_management'] || variantInventory['inventory_quantity'] <= 0 || this.options['inventoryQuantityThreshold'] > 0 && variantInventory['inventory_quantity'] > this.options['inventoryQuantityThreshold']) {
          productFormInventory.style.display = 'none';
        } else {
          let message = variantInventory['inventory_message']
          if(variantInventory['inventory_quantity'] > 10) {
            message = message.replaceAll(variantInventory['inventory_quantity'], "10+");
          }
          
          productFormInventory.innerHTML = message;
          productFormInventory.style.display = '';
        }
        
        // !!!!!!!!!!!!!!!!!!!!!!!!!
        if (!newVariant) {
          document.querySelector('.ProductForm__Helper').style.display = 'none';
        } else {
          document.querySelector('.ProductForm__Helper').style.display = '';
        }
        // !!!!!!!!!!!!!!!!!!!!!!!!!
        
      }

      /**
       * Update the SKU
       */

    }, {
      key: '_updateSku',
      value: function _updateSku(newVariant) {
        if (!this.options['showSku'] || !newVariant) {
          return;
        }

        var productSkuNumber = this.element.querySelector('.ProductMeta__SkuNumber');

        if (productSkuNumber && newVariant['sku']) {
          productSkuNumber.innerText = newVariant['sku'];
        }
      }

      /**
       * Update the unit price
       */

    }, {
      key: '_updateUnitPrice',
      value: function _updateUnitPrice(newVariant) {
        if (!newVariant) {
          return;
        }

        var unitPriceMeasurement = this.element.querySelector('.ProductMeta__UnitPriceMeasurement');

        if (!newVariant.hasOwnProperty('unit_price')) {
          unitPriceMeasurement.style.display = 'none';
          return;
        }

        unitPriceMeasurement.style.display = 'block';

        unitPriceMeasurement.querySelector('.UnitPriceMeasurement__Price').innerHTML = __WEBPACK_IMPORTED_MODULE_4__helper_Currency__["default"].formatMoney(newVariant['unit_price'], window.theme.moneyFormat);
        unitPriceMeasurement.querySelector('.UnitPriceMeasurement__ReferenceUnit').textContent = newVariant['unit_price_measurement']['reference_unit'];

        var unitPriceReferenceValue = unitPriceMeasurement.querySelector('.UnitPriceMeasurement__ReferenceValue');
        unitPriceReferenceValue.textContent = newVariant['unit_price_measurement']['reference_value'];
        unitPriceReferenceValue.style.display = newVariant['unit_price_measurement']['reference_value'] === 1 ? 'none' : 'inline';
      }

      /**
       * Update the add to cart
       */

    }, {
      key: '_updateAddToCartButton',
      value: function _updateAddToCartButton(newVariant) {
        var addToCartButton = this.element.querySelector('.ProductForm__AddToCart'),
            shopifyPaymentButton = this.element.querySelector('.shopify-payment-button');
        var preorder = addToCartButton.textContent.indexOf(window.themeOptions.preorder_cart) > -1 && window.themeOptions.preorder_cart != "";

        addToCartButton.classList.remove('Button--secondary');
        addToCartButton.classList.remove('Button--primary');

        if (!newVariant) {
          addToCartButton.setAttribute('disabled', 'disabled');
          addToCartButton.removeAttribute('data-action');
          addToCartButton.classList.add('Button--secondary');
          addToCartButton.innerHTML = window.languages.productFormUnavailable;
        } else {
          if (newVariant['available']) {

            addToCartButton.removeAttribute('disabled');
            addToCartButton.classList.add(addToCartButton.getAttribute('data-use-primary-button') === 'true' ? 'Button--primary' : 'Button--secondary');
            addToCartButton.setAttribute('data-action', 'add-to-cart');

            if (undefined === this.options['showPriceInButton'] || this.options['showPriceInButton']) {console.log("1");
              addToCartButton.innerHTML = '\n            <span>' + window.languages.productFormAddToCart + '</span>\n            <span class="Button__SeparatorDot"></span>\n            <span data-money-convertible>' + __WEBPACK_IMPORTED_MODULE_4__helper_Currency__["default"].formatMoney(newVariant['price'], window.theme.moneyFormat) + '</span>\n          ';
            } else {

              addToCartButton.innerHTML = '<span>' + window.languages.productFormAddToCart + '</span>';
            }
          } else {
            addToCartButton.setAttribute('disabled', 'disabled');
            addToCartButton.classList.add('Button--secondary');
            addToCartButton.removeAttribute('data-action');
            addToCartButton.innerHTML = window.languages.productFormSoldOut;
          }
        }

        if (this.options['showPaymentButton'] && shopifyPaymentButton) {
          if (!newVariant || !newVariant['available']) {
            shopifyPaymentButton.style.display = 'none';
          } else {
            shopifyPaymentButton.style.display = 'block';
          }
        }
        
        if(preorder) {
          addToCartButton.innerHTML = '<span>' + window.themeOptions.preorder_cart + '</span>';
        }
      }

      /**
       * ---------------------------------------------------------------------------------------------------
       * INTERNAL CODE THAT HANDLE VARIANT CHANGES
       * ---------------------------------------------------------------------------------------------------
       */

      /**
       * Whenever an option is changed, this code fetch the corresponding active variant
       */

    }, {
      key: '_onOptionChanged',
      value: function _onOptionChanged(newValue, target, activator) {
        // We change the value associated with the activator, and check if we have a color swatch
        if (activator) {
          this['option' + target.getAttribute('data-option-position')] = newValue;
          activator.querySelector('.ProductForm__SelectedValue').innerHTML = newValue;
        } else {
          this['option' + target.getAttribute('data-option-position')] = target.value;
          var selectedValue = target.closest('.ProductForm__Option').querySelector('.ProductForm__SelectedValue');

          if (selectedValue) {
            selectedValue.innerHTML = target.value;
          }
        }
        
        // Finally, we get the new variant
        var previousVariant = this.currentVariant;
        this.currentVariant = this._getCurrentVariantFromOptions();
        
        console.log(this.currentVariant );
        
        // [New Addition]
        document.querySelector(".ProductForm__Variants").setAttribute("data-option2", this.currentVariant.option2)


        this._onVariantChanged(previousVariant, this.currentVariant);

        if (this.currentVariant) {
          if (this.options['enableHistoryState']) {
            this._updateHistoryState(this.currentVariant);
          }

          // We need to modify the hidden select that contain the id attribute as well
          this.masterSelector.querySelector('[selected]').removeAttribute('selected');
          this.masterSelector.querySelector('[value="' + this.currentVariant['id'] + '"]').setAttribute('selected', 'selected');
          this.masterSelector.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }

      /**
       * Get the active variant based on the options
       */

    }, {
      key: '_getCurrentVariantFromOptions',
      value: function _getCurrentVariantFromOptions() {
        var _this7 = this;

        var found = false;

        this.productData['variants'].forEach(function (variant) {
          if (variant['option1'] === _this7.option1 && variant['option2'] === _this7.option2 && variant['option3'] === _this7.option3) {
            found = variant;
          }
        });

        return found || null;
      }

      /**
       * Update the history state for browsers that support it
       */

    }, {
      key: '_updateHistoryState',
      value: function _updateHistoryState(variant) {
        if (!history.replaceState) {
          return;
        }

        var newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;

        window.history.replaceState({ path: newUrl }, '', newUrl);
      }

      /**
       * ---------------------------------------------------------------------------------------------------
       * INTERNAL CODE THAT HANDLE PRODUCT ADD TO CART
       * ---------------------------------------------------------------------------------------------------
       */

    }, {
      key: '_addToCart',
      value: function _addToCart(event) {
        var _this8 = this;

        if (!this.options['useAjaxCart']) {
          return; // When using a cart type of page, we just simply redirect to the cart page
        }

        event.preventDefault(); // Prevent form to be submitted

        var addToCartButton = this.element.querySelector('.ProductForm__AddToCart');

        // First, we switch the status of the button
        addToCartButton.setAttribute('disabled', 'disabled');
        document.dispatchEvent(new CustomEvent('theme:loading:start'));

        // Then we add the product in Ajax
        var formElement = this.element.querySelector('form[action*="/cart/add"]');

        fetch(window.routes.cartAddUrl + '.js', {
          body: JSON.stringify(__WEBPACK_IMPORTED_MODULE_2__helper_Form__["default"].serialize(formElement)),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
          }
        }).then(function (response) {
          document.dispatchEvent(new CustomEvent('theme:loading:end'));
          if (response.ok) {
            addToCartButton.removeAttribute('disabled');
            // We simply trigger an event so the mini-cart can re-render
            _this8.element.dispatchEvent(new CustomEvent('product:added', {
              bubbles: true,
              detail: {
                variant: _this8.currentVariant,
                quantity: parseInt(formElement.querySelector('[name="quantity"]').value)
              }
            }));
          } else {
            response.json().then(function (content) {
              var errorMessageElement = document.createElement('span');
              errorMessageElement.className = 'ProductForm__Error Alert Alert--error';
              errorMessageElement.innerHTML = content['description'];
              addToCartButton.removeAttribute('disabled');
              addToCartButton.insertAdjacentElement('afterend', errorMessageElement);
              setTimeout(function () {
                errorMessageElement.remove();
              }, 2500);
            });
          }
        });

        event.preventDefault();
      }

      /**
       * ---------------------------------------------------------------------------------------------------
       * OTHER
       * ---------------------------------------------------------------------------------------------------
       */

      /**
       * When using the quantity selector, this can be used to decrease the quantity (be ensuring it won't be lower than 1)
       */

    }, {
      key: '_decreaseQuantity',
      value: function _decreaseQuantity(event, target) {
        target.nextElementSibling.value = Math.max(parseInt(target.nextElementSibling.value) - 1, 1);
      }

      /**
       * When using the quantity selector, this can be used to increase the quantity
       */

    }, {
      key: '_increaseQuantity',
      value: function _increaseQuantity(event, target) {
        target.previousElementSibling.value = parseInt(target.previousElementSibling.value) + 1;
      }

      /**
       * Make sure the quantity does not go below when manually changed
       */

    }, {
      key: '_validateQuantity',
      value: function _validateQuantity(event, target) {
        target.value = Math.max(parseInt(target.value) || 1, 1);
      }
    }]);

    return ProductVariants;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductVariants;

  /***/
},
/* 12 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var CountrySelector = function () {
    function CountrySelector(countrySelect, provinceSelect) {
      _classCallCheck(this, CountrySelector);

      this.countrySelect = countrySelect;
      this.provinceSelect = provinceSelect;

      if (this.countrySelect && this.provinceSelect) {
        this._attachListeners();
        this._initSelectors();
      }
    }

    _createClass(CountrySelector, [{
      key: 'destroy',
      value: function destroy() {
        if (this.countrySelect) {
          this.countrySelect.removeEventListener('change', this._onCountryChangedListener);
        }
      }
    }, {
      key: '_initSelectors',
      value: function _initSelectors() {
        // Check first the default value of country
        var defaultCountry = this.countrySelect.getAttribute('data-default');

        if (defaultCountry) {
          for (var i = 0; i !== this.countrySelect.options.length; ++i) {
            if (this.countrySelect.options[i].text === defaultCountry) {
              this.countrySelect.selectedIndex = i;
              break;
            }
          }
        } else {
          this.countrySelect.selectedIndex = 0;
        }

        var event = new Event('change', { bubbles: true });
        this.countrySelect.dispatchEvent(event);

        // Then the province
        var defaultProvince = this.provinceSelect.getAttribute('data-default');
        if (defaultProvince) {
          for (var _i = 0; _i !== this.provinceSelect.options.length; ++_i) {
            if (this.provinceSelect.options[_i].text === defaultProvince) {
              this.provinceSelect.selectedIndex = _i;
              break;
            }
          }
        }
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._onCountryChangedListener = this._onCountryChanged.bind(this);
        this.countrySelect.addEventListener('change', this._onCountryChangedListener);
      }
    }, {
      key: '_onCountryChanged',
      value: function _onCountryChanged() {
        var _this9 = this;

        var selectedOption = this.countrySelect.options[this.countrySelect.selectedIndex],
            provinces = JSON.parse(selectedOption.getAttribute('data-provinces') || '[]');

        // First remove all options
        this.provinceSelect.innerHTML = '';

        if (provinces.length === 0) {
          this.provinceSelect.parentNode.style.display = 'none';
          return;
        }

        // We need to build the provinces array
        provinces.forEach(function (data) {
          _this9.provinceSelect.options.add(new Option(data[1], data[0]));
        });

        this.provinceSelect.parentNode.style.display = 'block';
      }
    }]);

    return CountrySelector;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = CountrySelector;

  /***/
},
/* 13 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /**
   * This class allows to automatically scrolls within a div when this div does not fit into the visible space
   */

  var OverflowScroller = function () {
    function OverflowScroller(element) {
      _classCallCheck(this, OverflowScroller);

      if (!element) {
        return;
      }

      this.element = element;
      this.lastKnownY = window.scrollY;
      this.currentTop = 0;
      this.initialTopOffset = parseInt(window.getComputedStyle(this.element).top);

      this._attachListeners();
    }

    _createClass(OverflowScroller, [{
      key: 'destroy',
      value: function destroy() {
        window.removeEventListener('scroll', this._checkPositionListener);
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._checkPositionListener = this._checkPosition.bind(this);
        window.addEventListener('scroll', this._checkPositionListener);
      }
    }, {
      key: '_checkPosition',
      value: function _checkPosition() {
        var _this10 = this;

        fastdom.measure(function () {
          var bounds = _this10.element.getBoundingClientRect(),
              maxTop = bounds.top + window.scrollY - _this10.element.offsetTop + _this10.initialTopOffset,
              minTop = _this10.element.clientHeight - window.innerHeight;

          if (window.scrollY < _this10.lastKnownY) {
            _this10.currentTop -= window.scrollY - _this10.lastKnownY;
          } else {
            _this10.currentTop += _this10.lastKnownY - window.scrollY;
          }

          _this10.currentTop = Math.min(Math.max(_this10.currentTop, -minTop), maxTop, _this10.initialTopOffset);
          _this10.lastKnownY = window.scrollY;
        });

        fastdom.mutate(function () {
          _this10.element.style.top = _this10.currentTop + 'px';
        });
      }
    }]);

    return OverflowScroller;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = OverflowScroller;

  /***/
},
/* 14 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Image__ = __webpack_require__(9);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__helper_Responsive__ = __webpack_require__(1);

  var ProductImageZoom = function () {
    function ProductImageZoom(element, slideshow) {
      _classCallCheck(this, ProductImageZoom);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.delegateRoot = new domDelegate.Delegate(document.body);

      this.slideshow = slideshow;

      this._attachListeners();
    }

    _createClass(ProductImageZoom, [{
      key: 'destroy',
      value: function destroy() {
        this.delegateElement.off('click');
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '[data-action="open-product-zoom"]', this._initPhotoSwipe.bind(this));
        this.delegateElement.on('click', '.Product__SlideItem--image', this._initPhotoSwipeFromImageClick.bind(this));
      }

      /**
       * To save performance, we only initialize PhotoSwipe when it's requested. All high resolution images
       * are also loaded only on demand. Also, please note that PhotoSwipe is always completely destroyed
       * whenever it is closed, so it stays super snappy
       */

    }, {
      key: '_initPhotoSwipe',
      value: function _initPhotoSwipe() {
        var images = [];

        this.slideshow.flickityInstance.cells.forEach(function (item) {
          if (item.element.classList.contains('Product__SlideItem--image')) {
            images.push(item.element.querySelector('img'));
          }
        });

        this._createPhotoSwipeInstance(this._createPhotoSwipeItemsFromImages(images), parseInt(this.slideshow.flickityInstance.selectedElement.getAttribute('data-image-media-position')));
      }

      /**
       * On desktop we do not have the dedicated small icon, instead the zoom is triggered when clicking directly on the image
       */

    }, {
      key: '_initPhotoSwipeFromImageClick',
      value: function _initPhotoSwipeFromImageClick(event, target) {
        // Opening this way is only available on desktop
        if (__WEBPACK_IMPORTED_MODULE_2__helper_Responsive__["default"].matchesBreakpoint('pocket')) {
          return;
        }

        var images = __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.Product__SlideItem--image img'));

        this._createPhotoSwipeInstance(this._createPhotoSwipeItemsFromImages(images), parseInt(target.getAttribute('data-image-media-position')));
      }

      /**
       * Take a list of images and create a PhotoSwipe array. This is called whenever the gallery is initialized.
       */

    }, {
      key: '_createPhotoSwipeItemsFromImages',
      value: function _createPhotoSwipeItemsFromImages(images) {
        return images.map(function (image) {
          var maxWidth = parseInt(image.getAttribute('data-max-width')),
              maxHeight = parseInt(image.getAttribute('data-max-height')),
              maxDimension = __WEBPACK_IMPORTED_MODULE_2__helper_Responsive__["default"].matchesBreakpoint('phone') ? 1200 : 1800,
              // 1200 is max size for mobile and 1800 for larger devices
          reduceFactor = 1.0;

          if (maxWidth >= maxHeight) {
            reduceFactor = Math.max(maxWidth / maxDimension, 1.0);
          } else {
            reduceFactor = Math.max(maxHeight / maxDimension, 1.0);
          }

          var requestedWidth = Math.floor(maxWidth / reduceFactor);
          var requestedHeight = Math.floor(maxHeight / reduceFactor);

          return {
            msrc: image.currentSrc || image.src, // For browser that supports srcset, currentSrc is the currently used image
            w: requestedWidth,
            h: requestedHeight,
            initialZoomLevel: 0.65,
            src: __WEBPACK_IMPORTED_MODULE_1__helper_Image__["default"].getSizedImageUrl(image.getAttribute('data-original-src'), requestedWidth + 'x' + requestedHeight)
          };
        });
      }

      /**
       * Take a list of nodes containing all images and create a PhotoSwipe array. This is called
       * whenever the gallery is initialized.
       */

    }, {
      key: '_createPhotoSwipeInstance',
      value: function _createPhotoSwipeInstance(items, selectedImageIndex) {
        var _this11 = this;

        var photoswipeContainer = document.querySelector('.pswp');

        this.photoSwipeInstance = new PhotoSwipe(photoswipeContainer, false, items, {
          index: selectedImageIndex,
          showHideOpacity: true,
          showAnimationDuration: 500,
          loop: false,
          history: false,
          closeOnVerticalDrag: false,
          allowPanToNext: false,
          pinchToClose: false,
          errorMsg: '<p class="pswp__error-msg">' + window.languages.productImageLoadingError + '</p>',
          scaleMode: 'zoom',
          getDoubleTapZoom: function getDoubleTapZoom(isMouseClick, item) {
            if (isMouseClick) {
              return 1.6;
            } else {
              return item.initialZoomLevel < 0.7 ? 1 : 1.33;
            }
          },
          getThumbBoundsFn: function getThumbBoundsFn(index) {
            var thumbnail = _this11.element.querySelector('.Product__Slideshow .Carousel__Cell[data-image-media-position="' + parseInt(index) + '"] img'),
                pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                rect = thumbnail.getBoundingClientRect();

            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          }
        });

        this.photoSwipeInstance.listen('beforeChange', this._onSlideChanged.bind(this));
        this.photoSwipeInstance.listen('destroy', this._destroyPhotoSwipe.bind(this));
        this.photoSwipeInstance.listen('doubleTap', this._onDoubleTap.bind(this));
        this.photoSwipeInstance.listen('initialZoomIn', this._onInitialZoomIn.bind(this));
        this.photoSwipeInstance.listen('initialZoomOut', this._onInitialZoomOut.bind(this));

        this.delegateRoot.on('pswpTap', '.pswp__scroll-wrap', this._onSingleTap.bind(this));
        this.delegateRoot.on('pswpTap', '.pswp__button--close', this.photoSwipeInstance.close);
        this.delegateRoot.on('pswpTap', '.pswp__button--prev', this.photoSwipeInstance.prev);
        this.delegateRoot.on('pswpTap', '.pswp__button--next', this.photoSwipeInstance.next);

        this.photoSwipeInstance.init();
      }

      /**
       * Update the nav
       */

    }, {
      key: '_onSlideChanged',
      value: function _onSlideChanged() {
        if (this.photoSwipeInstance.getCurrentIndex() === 0) {
          this.photoSwipeInstance.scrollWrap.querySelector('.pswp__button--prev').setAttribute('disabled', 'disabled');
        } else {
          this.photoSwipeInstance.scrollWrap.querySelector('.pswp__button--prev').removeAttribute('disabled');
        }

        if (this.photoSwipeInstance.getCurrentIndex() + 1 === this.photoSwipeInstance.options.getNumItemsFn()) {
          this.photoSwipeInstance.scrollWrap.querySelector('.pswp__button--next').setAttribute('disabled', 'disabled');
        } else {
          this.photoSwipeInstance.scrollWrap.querySelector('.pswp__button--next').removeAttribute('disabled');
        }
      }

      /**
       * This event is a bit different and is triggered when the user click somewhere. We use it do allow to zoom in and
       * zoom out in the image on desktop and use for the UI
       */

    }, {
      key: '_onSingleTap',
      value: function _onSingleTap(event) {
        if (!event.detail || event.detail.pointerType === 'mouse') {
          if (event.target.classList.contains('pswp__img')) {
            this.photoSwipeInstance.toggleDesktopZoom(event.detail.releasePoint);
          }
        } else {
          if (event.target.classList.contains('pswp__button')) {
            return;
          }

          event.target.closest('.pswp').querySelector('.pswp__ui').classList.toggle('pswp__ui--hidden');
        }
      }
    }, {
      key: '_onDoubleTap',
      value: function _onDoubleTap(point) {
        var initialZoomLevel = this.photoSwipeInstance.currItem.initialZoomLevel;

        if (this.photoSwipeInstance.getZoomLevel() !== initialZoomLevel) {
          this.photoSwipeInstance.zoomTo(initialZoomLevel, point, 333);
        } else {
          this.photoSwipeInstance.zoomTo(initialZoomLevel < 0.7 ? 1 : 1.33, point, 333);
        }
      }
    }, {
      key: '_onInitialZoomIn',
      value: function _onInitialZoomIn() {
        document.querySelector('.pswp__ui').classList.remove('pswp__ui--hidden');
      }
    }, {
      key: '_onInitialZoomOut',
      value: function _onInitialZoomOut() {
        document.querySelector('.pswp__ui').classList.add('pswp__ui--hidden');
      }

      /**
       * PhotoSwipe instance is automatically destroyed for us when it's closed. What we need to do is simply re-set
       * our in-memory instance to null and our own events
       */

    }, {
      key: '_destroyPhotoSwipe',
      value: function _destroyPhotoSwipe() {
        this.delegateRoot.off('pswpTap');
        this.photoSwipeInstance = null;
      }
    }]);

    return ProductImageZoom;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductImageZoom;

  /***/
},
/* 15 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Responsive__ = __webpack_require__(1);

  var ProductModel = function () {
    function ProductModel(element, stackProductImages) {
      _classCallCheck(this, ProductModel);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.delegateRoot = new domDelegate.Delegate(document.documentElement);
      this.stackProductImages = stackProductImages;

      this._attachListeners();

      var stylesheet = document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = 'https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css';
      document.head.appendChild(stylesheet);

      window.Shopify.loadFeatures([{
        name: 'model-viewer-ui',
        version: '1.0',
        onLoad: this._setupModelViewerUI.bind(this)
      }, {
        name: 'shopify-xr',
        version: '1.0'
      }]);
    }

    _createClass(ProductModel, [{
      key: 'destroy',
      value: function destroy() {}
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        var _this12 = this;

        this.element.querySelector('model-viewer').addEventListener('shopify_model_viewer_ui_toggle_play', function () {
          _this12.element.dispatchEvent(new CustomEvent('model:played', { bubbles: true }));
        });
        this.element.querySelector('model-viewer').addEventListener('shopify_model_viewer_ui_toggle_pause', function () {
          _this12.element.dispatchEvent(new CustomEvent('model:paused', { bubbles: true }));
        });
      }
    }, {
      key: 'hasBeenSelected',
      value: function hasBeenSelected() {
        // As per guidelines, we only need to autoplay when it's not a touch device
        if (__WEBPACK_IMPORTED_MODULE_0__helper_Responsive__["default"].matchesBreakpoint('supports-hover')) {
          this.modelUi.play();
        }
      }
    }, {
      key: 'hasBeenDeselected',
      value: function hasBeenDeselected() {
        // In all cases, we just turn it off
        this.modelUi.pause();
      }
    }, {
      key: '_setupModelViewerUI',
      value: function _setupModelViewerUI() {
        this.modelElement = this.element.querySelector('model-viewer');
        this.modelUi = new window.Shopify.ModelViewerUI(this.modelElement);
      }
    }]);

    return ProductModel;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductModel;

  /***/
},
/* 16 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var ProductReviews = function () {
    function ProductReviews(container) {
      _classCallCheck(this, ProductReviews);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);

      this.delegateElement.on('click', '.spr-summary-actions-newreview', this._onNewReviewClicked.bind(this));

      // Extending Shopify Reviews is a bit manual, but let's do it!

      window.SPRCallbacks = {};
      window.SPRCallbacks.onFormSuccess = this._onFormSuccess.bind(this);
      window.SPRCallbacks.onReviewsLoad = this._onReviewsLoad.bind(this);
    }

    _createClass(ProductReviews, [{
      key: 'destroy',
      value: function destroy() {
        this.delegateElement.off();
      }
    }, {
      key: '_updatePagination',
      value: function _updatePagination(event, target) {
        // Unfortunately, we have to use this ugly jQuery style stuff
        SPR.$(target).data('page', parseInt(target.getAttribute('data-page')) + 1);
      }
    }, {
      key: '_onFormSuccess',
      value: function _onFormSuccess() {
        var formSuccess = this.element.querySelector('.spr-form-message-success');
        window.scrollTo(0, formSuccess.offsetTop - 45);
      }
    }, {
      key: '_onReviewsLoad',
      value: function _onReviewsLoad() {
        // We want to move "spr-pagination-next" before the "new review" button in the "spr-summary-actions" div

        var sprSummaryActions = this.element.querySelector('.spr-summary-actions'),
            previousSprPaginationNext = sprSummaryActions.querySelector('.spr-pagination-next'),
            sprPaginationNext = this.element.querySelector('.spr-pagination .spr-pagination-next');

        if (previousSprPaginationNext) {
          previousSprPaginationNext.remove();
        }

        if (sprPaginationNext) {
          sprSummaryActions.insertBefore(sprPaginationNext, sprSummaryActions.firstChild);
        }
      }
    }, {
      key: '_onNewReviewClicked',
      value: function _onNewReviewClicked(event, target) {
        target.style.display = 'none';

        if (target.previousElementSibling) {
          target.previousElementSibling.style.display = 'none';
        }
      }
    }]);

    return ProductReviews;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductReviews;

  /***/
},
/* 17 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__ = __webpack_require__(5);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__helper_Currency__ = __webpack_require__(8);
  /**
   * Variant selector is a bit similar to the popover, but due to some differences, I've created a distinct class
   */

  var VariantSelector = function () {
    function VariantSelector(element, parentProductVariants) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, VariantSelector);

      this.element = element;
      this.parentProductVariants = parentProductVariants;
      this.delegateElement = new domDelegate.Delegate(this.element);

      this.activator = options['activator'] || document.querySelector('[aria-controls="' + element.getAttribute('id') + '"]');
      this.onValueChangedCallback = options['onValueChanged'] || function () {};
      this.isOpen = false;

      this.pageOverlayElement = document.querySelector('.PageOverlay');

      this.variantChoiceList = __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.VariantSelector__Choice'));
      this.variantCarousel = new __WEBPACK_IMPORTED_MODULE_1__Carousel__["default"](this.element.querySelector('.VariantSelector__Carousel'), {
        onSelect: this._variantChanged.bind(this),
        onClick: this._variantSelected.bind(this)
      });

      this._attachListeners();
    }

    _createClass(VariantSelector, [{
      key: 'destroy',
      value: function destroy() {
        this.element.removeEventListener('keyup', this._handleKeyboardListener);
        this.delegateElement.off('click');
        this.activator.removeEventListener('click', this._toggleListener);
        this.variantCarousel.destroy();
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.isOpen ? this.close() : this.open();
      }
    }, {
      key: 'open',
      value: function open() {
        if (this.isOpen) {
          return;
        }

        this.element.setAttribute('aria-hidden', 'false');
        this.activator.setAttribute('aria-expanded', 'true');

        __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].trapFocus(this.element, 'variant-selector');

        document.documentElement.classList.add('no-scroll'); // Prevent scrolling when popover is open

        this.element.setAttribute('style', '');
        this.pageOverlayElement.classList.add('is-visible');
        this.pageOverlayElement.addEventListener('click', this._closeListener);

        this.isOpen = true;
      }
    }, {
      key: 'close',
      value: function close() {
        if (!this.isOpen) {
          return;
        }

        this.element.setAttribute('aria-hidden', 'true');
        this.activator.setAttribute('aria-expanded', 'false');

        __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].removeTrapFocus(this.element, 'variant-selector');

        document.documentElement.classList.remove('no-scroll');

        this.pageOverlayElement.classList.remove('is-visible');
        this.pageOverlayElement.removeEventListener('click', this._closeListener);

        this.isOpen = false;
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._handleKeyboardListener = this._handleKeyboard.bind(this);
        this._closeListener = this.close.bind(this);
        this._toggleListener = this.toggle.bind(this);

        this.element.addEventListener('keyup', this._handleKeyboardListener);
        this.activator.addEventListener('click', this._toggleListener);
        this.delegateElement.on('click', '[data-action="select-variant"]', this._onVariantSelect.bind(this));

        this.parentProductVariants.delegateElement.on('variant:changed', this._onVariantChanged.bind(this));
      }

      /**
       * Called when the variant is changed (but not yet selected)
       */

    }, {
      key: '_variantChanged',
      value: function _variantChanged(selectedIndex) {
        var activeChoice = this.variantChoiceList[selectedIndex];

        activeChoice.classList.add('is-selected');
        __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].getSiblings(activeChoice, '.is-selected').forEach(function (item) {
          return item.classList.remove('is-selected');
        });
      }

      /**
       * Called when a variant is clicked or selected
       */

    }, {
      key: '_variantSelected',
      value: function _variantSelected(cellElement, cellIndex) {
        
        if (this.variantCarousel.getSelectedIndex() === cellIndex) {
          this.onValueChangedCallback(cellElement.getAttribute('data-option-value'), cellElement, this.activator);
          this.close();
        } else {
          this.variantCarousel.selectCell(cellIndex);
        }
      }
    }, {
      key: '_onVariantChanged',
      value: function _onVariantChanged(event) {
        var _this13 = this;

        
        var selectedVariant = event.detail.variant,
            imageWrapperElements = this.element.querySelectorAll('.VariantSelector__ImageWrapper'),
            found = false;

        __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(imageWrapperElements).forEach(function (image) {
          var colorPosition = parseInt(image.parentElement.getAttribute('data-option-position')) - 1,
              combinationExcludedColor = '';

          selectedVariant.options.forEach(function (optionValue, index) {
            if (index !== colorPosition) {
              combinationExcludedColor += optionValue;
            }
          });

          if (image.getAttribute('data-variant-title') === combinationExcludedColor) {
            
            image.setAttribute('aria-hidden', 'false');
            found = true;
          } else {
            image.setAttribute('aria-hidden', 'true');
          }
        });

        if (!found) {
          imageWrapperElements.children[0].setAttribute('aria-hidden', 'false');
        }

        var foundColorIndex = 0;

        __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.VariantSelector__ChoicePrice')).forEach(function (priceElement, index) {
          var colorPosition = parseInt(priceElement.getAttribute('data-color-position')) - 1;

          _this13.parentProductVariants.productData['variants'].forEach(function (variant) {
            var matchOptionsExcludedColor = true;

            variant['options'].forEach(function (option, index) {
              if (index !== colorPosition) {
                if (variant['options'][index] !== selectedVariant['options'][index]) {
                  matchOptionsExcludedColor = false;
                }
              }
            });

            if (matchOptionsExcludedColor && variant['options'][colorPosition] === selectedVariant['options'][colorPosition]) {
              if (foundColorIndex++ === index) {
                priceElement.innerHTML = '<span class="Heading Text--subdued">' + __WEBPACK_IMPORTED_MODULE_3__helper_Currency__["default"].formatMoney(variant['price'], window.theme.moneyFormat) + '</span>';
              }
            }
          });
        });
      }

      /**
       * Called when the button "choose this variant" is explicitly clicked
       */

    }, {
      key: '_onVariantSelect',
      value: function _onVariantSelect() {
        var selectedCell = this.variantCarousel.flickityInstance.selectedCell.element;

        this.onValueChangedCallback(selectedCell.getAttribute('data-option-value'), selectedCell, this.activator);
        this.close();
      }

      /**
       * Handle a11y events
       */

    }, {
      key: '_handleKeyboard',
      value: function _handleKeyboard(event) {
        if (this.isOpen && event.keyCode === 27) {
          this.close();
        }
      }
    }]);

    return VariantSelector;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = VariantSelector;

  /***/
},
/* 18 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Responsive__ = __webpack_require__(1);

  var ProductVideo = function () {
    function ProductVideo(element, stackProductImages, enableVideoLooping) {
      _classCallCheck(this, ProductVideo);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.stackProductImages = stackProductImages;
      this.enableVideoLooping = enableVideoLooping;
      this.player = null;

      switch (this.element.getAttribute('data-media-type')) {
        case 'video':
          var stylesheet = document.createElement('link');
          stylesheet.rel = 'stylesheet';
          stylesheet.href = 'https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css';
          document.head.appendChild(stylesheet);

          window.Shopify.loadFeatures([{
            name: 'video-ui',
            version: '1.0',
            onLoad: this._setupHtml5Video.bind(this)
          }]);
          break;

        case 'external_video':
          this._setupExternalVideo();
          break;
      }
    }

    _createClass(ProductVideo, [{
      key: 'destroy',
      value: function destroy() {
        if (this.player) {
          this.player.destroy(); // Both Plyr and YouTube API use the same name
        }
      }
    }, {
      key: 'hasBeenSelected',
      value: function hasBeenSelected() {
        // As per guidelines, we only need to autoplay when it's not a touch device
        if (__WEBPACK_IMPORTED_MODULE_0__helper_Responsive__["default"].matchesBreakpoint('supports-hover')) {
          this.play();
        }
      }
    }, {
      key: 'hasBeenDeselected',
      value: function hasBeenDeselected() {
        this.pause();
      }
    }, {
      key: 'play',
      value: function play() {
        switch (this.element.getAttribute('data-media-type')) {
          case 'video':
            this.player.play();
            break;

          case 'external_video':
            this.player.playVideo();
            break;
        }
      }
    }, {
      key: 'pause',
      value: function pause() {
        switch (this.element.getAttribute('data-media-type')) {
          case 'video':
            this.player.pause();
            break;

          case 'external_video':
            this.player.pauseVideo();
            break;
        }
      }
    }, {
      key: '_setupHtml5Video',
      value: function _setupHtml5Video() {
        var _this14 = this;

        this.player = new Shopify.Plyr(this.element.querySelector('video'), {
          controls: ['play', 'progress', 'mute', 'volume', 'play-large', 'fullscreen'],
          loop: { active: this.enableVideoLooping },
          hideControlsOnPause: true,
          clickToPlay: true,
          iconUrl: '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
          tooltips: {
            controls: false,
            seek: true
          }
        });

        this.player.on('play', function () {
          _this14.element.dispatchEvent(new CustomEvent('video:played', { bubbles: true }));
        });
        this.player.on('pause', function () {
          _this14.element.dispatchEvent(new CustomEvent('video:paused', { bubbles: true }));
        });
      }
    }, {
      key: '_setupExternalVideo',
      value: function _setupExternalVideo() {
        if (this.element.getAttribute('data-video-host') === 'youtube') {
          this._loadYouTubeScript().then(this._setupYouTubePlayer.bind(this));
        }
      }
    }, {
      key: '_setupYouTubePlayer',
      value: function _setupYouTubePlayer() {
        var _this15 = this;

        var playerLoadingInterval = setInterval(function () {
          if (window.YT !== undefined && window.YT.Player !== undefined) {
            _this15.player = new YT.Player(_this15.element.querySelector('iframe'), {
              videoId: _this15.element.getAttribute('data-video-id'),
              events: {
                onStateChange: function onStateChange(event) {
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    _this15.element.dispatchEvent(new CustomEvent('video:played', { bubbles: true }));
                  } else if (event.data === YT.PlayerState.PAUSED) {
                    _this15.element.dispatchEvent(new CustomEvent('video:paused', { bubbles: true }));
                  }

                  if (event.data === window.YT.PlayerState.ENDED && _this15.enableVideoLooping) {
                    event.target.seekTo(0);
                  }
                }
              }
            });

            clearInterval(playerLoadingInterval);
          }
        }, 50);
      }
    }, {
      key: '_loadYouTubeScript',
      value: function _loadYouTubeScript() {
        return new Promise(function (resolve, reject) {
          var script = document.createElement('script');
          document.body.appendChild(script);
          script.onload = resolve;
          script.onerror = reject;
          script.async = true;
          script.src = '//www.youtube.com/iframe_api';
        });
      }
    }]);

    return ProductVideo;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductVideo;

  /***/
},
/* 19 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /**
   * This code has been heavily inspired by this: https://kitaitimakoto.gitlab.io/scrollspy-example/index.en.html#whatsthis
   */

  var ScrollSpy = function () {
    function ScrollSpy(container, elementsToSpy, observerOptions) {
      var _this16 = this;

      _classCallCheck(this, ScrollSpy);

      this.container = container;
      this.targets = [];
      this.targetIndices = {};
      this.indicesInViewPort = [];

      this.observer = new IntersectionObserver(this._onIntersectionChange.bind(this), observerOptions);

      elementsToSpy.forEach(function (elementToSpy, index) {
        _this16.targets.push(elementToSpy);
        _this16.targetIndices[elementToSpy.id] = index;
        _this16.observer.observe(elementToSpy);
      });
    }

    _createClass(ScrollSpy, [{
      key: 'destroy',
      value: function destroy() {
        this.observer.disconnect();
      }

      /**
       * Called whenever there is a change of visibility
       */

    }, {
      key: '_onIntersectionChange',
      value: function _onIntersectionChange(changes) {
        var oldTargetIndex = this.indicesInViewPort[0] || 0;

        for (var i = changes.length - 1; i >= 0; i--) {
          this._updateIndicesInViewPort(changes[i], oldTargetIndex);
        }

        // Firefox generates duplicates so make sure to remove
        this.indicesInViewPort = this.indicesInViewPort.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });

        if (this.indicesInViewPort.length === 0 || oldTargetIndex === this.indicesInViewPort[0]) {
          return;
        }

        var event = new CustomEvent('scrollspy:target:changed', {
          detail: {
            newTarget: this.targets[this.indicesInViewPort[0]],
            oldTarget: this.targets[oldTargetIndex]
          }
        });

        this.container.dispatchEvent(event);
      }

      /**
       * Update indices visible in the view port
       */

    }, {
      key: '_updateIndicesInViewPort',
      value: function _updateIndicesInViewPort(change, oldTargetIndex) {
        var index = this.targetIndices[change.target.id];

        if (change.intersectionRatio === 0) {
          var indexInViewPort = this.indicesInViewPort.indexOf(index);

          if (indexInViewPort !== -1) {
            this.indicesInViewPort.splice(indexInViewPort, 1);
          }
        } else {
          if (index < oldTargetIndex) {
            this.indicesInViewPort.unshift(index);
          } else if (index > this.indicesInViewPort[this.indicesInViewPort.length - 1]) {
            this.indicesInViewPort.push(index);
          } else {
            this.indicesInViewPort.push(index);
            this.indicesInViewPort.sort();
          }
        }
      }
    }]);

    return ScrollSpy;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ScrollSpy;

  /***/
},
/* 20 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Animation__ = __webpack_require__(7);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Currency__ = __webpack_require__(8);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__CountrySelector__ = __webpack_require__(12);

  var ShippingEstimator = function () {
    function ShippingEstimator(element) {
      _classCallCheck(this, ShippingEstimator);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.countrySelector = new __WEBPACK_IMPORTED_MODULE_2__CountrySelector__["default"](this.element.querySelector('[name="country"]'), this.element.querySelector('[name="province"]'));

      this._attachListeners();
    }

    _createClass(ShippingEstimator, [{
      key: 'onUnload',
      value: function onUnload() {
        this.delegateElement.off('click');
        this.countrySelector.destroy();
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '.ShippingEstimator__Submit', this._fetchRates.bind(this));
      }
    }, {
      key: '_fetchRates',
      value: function _fetchRates() {
        var _this17 = this;

        var country = this.element.querySelector('[name="country"]').value,
            province = this.element.querySelector('[name="province"]').value,
            zip = this.element.querySelector('[name="zip"]').value;

        document.dispatchEvent(new CustomEvent('theme:loading:start'));

        fetch(window.routes.cartUrl + '/shipping_rates.json?shipping_address[zip]=' + zip + '&shipping_address[country]=' + country + '&shipping_address[province]=' + province, {
          credentials: 'same-origin',
          method: 'GET'
        }).then(function (response) {
          response.json().then(function (result) {
            document.dispatchEvent(new CustomEvent('theme:loading:end'));

            var resultsContainer = _this17.element.querySelector('.ShippingEstimator__Results'),
                errorContainer = _this17.element.querySelector('.ShippingEstimator__Error');

            if (response.ok) {
              var shippingRates = result['shipping_rates'];

              if (shippingRates.length === 0) {
                resultsContainer.innerHTML = '<p>' + window.languages.shippingEstimatorNoResults + '</p>';
              } else {
                var html = '';

                if (shippingRates.length === 1) {
                  html += '<p>' + window.languages.shippingEstimatorOneResult + '</p><ul>';
                } else {
                  html += '<p>' + window.languages.shippingEstimatorMoreResults.replace('{{count}}', shippingRates.length) + '</p><ul>';
                }

                shippingRates.forEach(function (item) {
                  html += '<li>' + item['name'] + ': ' + __WEBPACK_IMPORTED_MODULE_1__helper_Currency__["default"].formatMoney(item['price'], window.theme.moneyFormat) + '</li>';
                });

                html += '</ul>';

                resultsContainer.firstElementChild.innerHTML = html;
              }

              TweenLite.fromTo(resultsContainer.firstElementChild, 0.6, { autoAlpha: 0, y: -15 }, { autoAlpha: 1, y: 0, delay: 0.35 });

              errorContainer.style.display = 'none';
              resultsContainer.style.display = 'block';

              __WEBPACK_IMPORTED_MODULE_0__helper_Animation__["default"].slideDown(resultsContainer);
            } else {
              var errorHtml = '';

              Object.keys(result).forEach(function (key) {
                errorHtml += '<li class="Alert__ErrorItem">' + key + ' ' + result[key] + '</li>';
              });

              errorContainer.innerHTML = '<ul class="Alert__ErrorList">' + errorHtml + '</ul>';

              resultsContainer.style.display = 'none';
              errorContainer.style.display = 'block';
            }
          });
        });
      }
    }]);

    return ShippingEstimator;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ShippingEstimator;

  /***/
},
/* 21 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__Carousel__ = __webpack_require__(2);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "Carousel", function () {
    return __WEBPACK_IMPORTED_MODULE_0__Carousel__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__Collapsible__ = __webpack_require__(23);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "Collapsible", function () {
    return __WEBPACK_IMPORTED_MODULE_1__Collapsible__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__Drawer__ = __webpack_require__(6);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "Drawer", function () {
    return __WEBPACK_IMPORTED_MODULE_2__Drawer__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__LoadingBar__ = __webpack_require__(24);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "LoadingBar", function () {
    return __WEBPACK_IMPORTED_MODULE_3__LoadingBar__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__Modal__ = __webpack_require__(25);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "Modal", function () {
    return __WEBPACK_IMPORTED_MODULE_4__Modal__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__Popover__ = __webpack_require__(3);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "Popover", function () {
    return __WEBPACK_IMPORTED_MODULE_5__Popover__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_6__PageTransition__ = __webpack_require__(26);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "PageTransition", function () {
    return __WEBPACK_IMPORTED_MODULE_6__PageTransition__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_7__ProductItemColorSwatch__ = __webpack_require__(4);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductItemColorSwatch", function () {
    return __WEBPACK_IMPORTED_MODULE_7__ProductItemColorSwatch__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_8__ProductImageZoom__ = __webpack_require__(14);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductImageZoom", function () {
    return __WEBPACK_IMPORTED_MODULE_8__ProductImageZoom__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_9__ProductModel__ = __webpack_require__(15);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductModel", function () {
    return __WEBPACK_IMPORTED_MODULE_9__ProductModel__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_10__ProductReviews__ = __webpack_require__(16);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductReviews", function () {
    return __WEBPACK_IMPORTED_MODULE_10__ProductReviews__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_11__ProductVariants__ = __webpack_require__(11);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductVariants", function () {
    return __WEBPACK_IMPORTED_MODULE_11__ProductVariants__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_12__ProductVideo__ = __webpack_require__(18);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductVideo", function () {
    return __WEBPACK_IMPORTED_MODULE_12__ProductVideo__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_13__ScrollSpy__ = __webpack_require__(19);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ScrollSpy", function () {
    return __WEBPACK_IMPORTED_MODULE_13__ScrollSpy__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_14__SearchBar__ = __webpack_require__(28);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "SearchBar", function () {
    return __WEBPACK_IMPORTED_MODULE_14__SearchBar__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_15__ShippingEstimator__ = __webpack_require__(20);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ShippingEstimator", function () {
    return __WEBPACK_IMPORTED_MODULE_15__ShippingEstimator__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_16__VariantSelector__ = __webpack_require__(17);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "VariantSelector", function () {
    return __WEBPACK_IMPORTED_MODULE_16__VariantSelector__["default"];
  });

  /***/
},
/* 22 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /**
   * This implementation allows to serialize a form
   */

  var Form = function () {
    function Form() {
      _classCallCheck(this, Form);
    }

    _createClass(Form, null, [{
      key: 'serialize',
      value: function serialize(form) {
        function stringKey(key, value) {
          var beginBracket = key.lastIndexOf('[');

          if (beginBracket === -1) {
            var _hash = {};
            _hash[key] = value;
            return _hash;
          }

          var newKey = key.substr(0, beginBracket);
          var newValue = {};

          newValue[key.substring(beginBracket + 1, key.length - 1)] = value;

          return stringKey(newKey, newValue);
        }

        var hash = {};

        for (var i = 0, len = form.elements.length; i < len; i++) {
          var formElement = form.elements[i];

          if (formElement.name === '' || formElement.disabled) {
            continue;
          }

          if (formElement.name && !formElement.disabled && (formElement.checked || /select|textarea/i.test(formElement.nodeName) || /hidden|text|search|tel|url|email|password|datetime|date|month|week|time|datetime-local|number|range|color/i.test(formElement.type))) {
            var stringKeys = stringKey(formElement.name, formElement.value);
            hash = Form.extend(hash, stringKeys);
          }
        }

        return hash;
      }
    }, {
      key: 'extend',
      value: function extend() {
        var extended = {};
        var i = 0;

        // Merge the object into the extended object
        var merge = function merge(obj) {
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              // If property is an object, merge properties
              if (Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                extended[prop] = Form.extend(extended[prop], obj[prop]);
              } else {
                extended[prop] = obj[prop];
              }
            }
          }
        };

        // Loop through each object and conduct a merge
        for (; i < arguments.length; i++) {
          merge(arguments[i]);
        }

        return extended;
      }
    }]);

    return Form;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Form;

  /***/
},
/* 23 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Animation__ = __webpack_require__(7);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__helper_Responsive__ = __webpack_require__(1);
  /**
   * Handle the collapsibles. This plugin is global, so it listens to any click on [data-action="toggle-collapsible"] element
   */

  var Collapsible = function () {
    function Collapsible() {
      _classCallCheck(this, Collapsible);

      this.domDelegate = new domDelegate.Delegate(document.body);
      this._attachListeners();
    }

    _createClass(Collapsible, [{
      key: '_attachListeners',
      value: function _attachListeners() {
        this.domDelegate.on('click', '[data-action="toggle-collapsible"]', this._toggleCollapsible.bind(this));
      }

      /**
       * Toggle a given collapsible
       */

    }, {
      key: '_toggleCollapsible',
      value: function _toggleCollapsible(event, target) {
        var _this18 = this;

        // If this is an auto-expand and that it reaches the needed breakpoint, we do nothing
        var parentCollapsible = target.closest('.Collapsible');

        if (parentCollapsible.classList.contains('Collapsible--autoExpand') && __WEBPACK_IMPORTED_MODULE_2__helper_Responsive__["default"].matchesBreakpoint('tablet-and-up')) {
          return;
        }

        var isOpen = target.getAttribute('aria-expanded') === 'true';

        if (isOpen) {
          this._close(parentCollapsible, target);
        } else {
          this._open(parentCollapsible, target);
        }

        // We make sure to close any siblings collapsible as well
        __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].getSiblings(parentCollapsible).forEach(function (collapsibleToClose) {
          return _this18._close(collapsibleToClose);
        });
        event.preventDefault();
      }

      /**
       * Open a given collapsible
       */

    }, {
      key: '_open',
      value: function _open(collapsible) {
        var toggleButton = collapsible.querySelector('.Collapsible__Button'),
            collapsibleInner = collapsible.querySelector('.Collapsible__Inner');

        if (!collapsibleInner || toggleButton.getAttribute('aria-expanded') === 'true') {
          return; // It's already open
        }

        toggleButton.setAttribute('aria-expanded', 'true');
        collapsibleInner.style.overflow = 'visible';
        __WEBPACK_IMPORTED_MODULE_0__helper_Animation__["default"].slideDown(collapsibleInner);
      }

      /**
       * Close a given collapsible
       */

    }, {
      key: '_close',
      value: function _close(collapsible) {
        var toggleButton = collapsible.querySelector('.Collapsible__Button'),
            collapsibleInner = collapsible.querySelector('.Collapsible__Inner');

        if (!collapsibleInner || toggleButton.getAttribute('aria-expanded') === 'false') {
          return; // It's already closed
        }

        toggleButton.setAttribute('aria-expanded', 'false');
        collapsibleInner.style.overflow = 'hidden';
        __WEBPACK_IMPORTED_MODULE_0__helper_Animation__["default"].slideUp(collapsibleInner);
      }
    }]);

    return Collapsible;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Collapsible;

  /***/
},
/* 24 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /**
   * Simple plugin that handles the loading bar actions
   *
   * This plugin uses delegate events so it's independent of the sections.
   */

  var LoadingBar = function () {
    function LoadingBar() {
      _classCallCheck(this, LoadingBar);

      this.element = document.querySelector('.LoadingBar');

      document.addEventListener('theme:loading:start', this._onLoadingStart.bind(this));
      document.addEventListener('theme:loading:end', this._onLoadingEnd.bind(this));

      this.element.addEventListener('transitionend', this._onTransitionEnd.bind(this));
    }

    _createClass(LoadingBar, [{
      key: '_onLoadingStart',
      value: function _onLoadingStart() {
        this.element.classList.add('is-visible');
        this.element.style.width = '40%';
      }
    }, {
      key: '_onLoadingEnd',
      value: function _onLoadingEnd() {
        this.element.style.width = '100%';
        this.element.classList.add('is-finished');
      }
    }, {
      key: '_onTransitionEnd',
      value: function _onTransitionEnd(event) {
        if (event.propertyName === 'width' && this.element.classList.contains('is-finished')) {
          this.element.classList.remove('is-visible');
          this.element.classList.remove('is-finished');
          this.element.style.width = '0';
        }
      }
    }]);

    return LoadingBar;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = LoadingBar;

  /***/
},
/* 25 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__ = __webpack_require__(5);
  /**
   * Handle the modals. This plugin is global, so it basically listens to any click on [data-action="open-modal"] and
   * [data-action="close-modal"] events
   */

  var Modal = function () {
    function Modal() {
      _classCallCheck(this, Modal);

      this.domDelegate = new domDelegate.Delegate(document.body);
      this.activeModal = null; // Keep track of the active modal
      this.wasLocked = false;

      this.pageOverlayElement = document.querySelector('.PageOverlay');

      this._attachListeners();
      this._checkOpenByHash();
    }

    _createClass(Modal, [{
      key: '_attachListeners',
      value: function _attachListeners() {
        this._closeListener = this._closeModal.bind(this);
        this._handleKeyboardListener = this._handleKeyboard.bind(this);

        this.domDelegate.on('click', '[data-action="open-modal"]', this._openModalEvent.bind(this));
        this.domDelegate.on('click', '[data-action="close-modal"]', this._closeModal.bind(this));
      }
    }, {
      key: '_openModalEvent',
      value: function _openModalEvent(event, target) {
        this._openModal(document.getElementById(target.getAttribute('aria-controls')));
        event.preventDefault();
        event.stopPropagation();
      }
    }, {
      key: '_openModal',
      value: function _openModal(modal) {
        var _this19 = this;

        if (this.activeModal || !modal) {
          return; // If there is already an open modal, we return as we only allows one modal at a time
        }

        this.activeModal = modal;
        this.domDelegate.on('keyup', this._handleKeyboardListener);

        if (document.documentElement.classList.contains('no-scroll')) {
          this.wasLocked = true;
        }

        fastdom.mutate(function () {
          __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].clearTrapFocus(); // Needed as the modal can be open on top of a popover

          _this19._onTransitionEndedListener = _this19._onTransitionEnded.bind(_this19);
          _this19.activeModal.addEventListener('transitionend', _this19._onTransitionEndedListener);

          _this19.activeModal.setAttribute('aria-hidden', 'false');
          document.documentElement.classList.add('no-scroll');

          // If the modal is not a fullscreen modal, then we also display the overlay
          if (!_this19.activeModal.classList.contains('Modal--fullScreen')) {
            _this19.pageOverlayElement.classList.add('is-visible');
            _this19.pageOverlayElement.addEventListener('click', _this19._closeListener);
          }
        });
      }
    }, {
      key: '_closeModal',
      value: function _closeModal() {
        var _this20 = this;

        if (!this.activeModal) {
          return; // If no modal are open, we return immediately
        }

        this.activeModal.removeEventListener('keyup', this._handleKeyboardListener);
        this.domDelegate.off('keyup');

        fastdom.mutate(function () {
          // If the modal is of video type, we need to remove the iframe to stop the video
          if (_this20.activeModal.classList.contains('Modal--videoContent')) {
            _this20._resetVideoListener = _this20._resetVideo.bind(_this20);
            _this20.activeModal.addEventListener('transitionend', _this20._resetVideoListener);
          }

          __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].removeTrapFocus(_this20.activeModal, 'modal');

          if (!_this20.activeModal.classList.contains('Modal--fullScreen')) {
            _this20.pageOverlayElement.classList.remove('is-visible');
            _this20.pageOverlayElement.removeEventListener('click', _this20._closeListener);
          }

          _this20.activeModal.setAttribute('aria-hidden', 'true');
          _this20.activeModal = null;

          if (!_this20.wasLocked) {
            document.documentElement.classList.remove('no-scroll');
          }
        });
      }
    }, {
      key: '_onTransitionEnded',
      value: function _onTransitionEnded(event) {
        if (event.propertyName !== 'visibility') {
          return;
        }

        __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].trapFocus(this.activeModal, 'modal'); // Trap the focus first (as this trigger reflows)

        this.activeModal.removeEventListener('transitionend', this._onTransitionEndedListener);
      }
    }, {
      key: '_resetVideo',
      value: function _resetVideo(event) {
        if (event.propertyName !== 'visibility') {
          return; // We check the visibility property as it's the one LazySizes uses for triggering lazyloading
        }

        var iframe = event.target.querySelector('iframe');
        iframe.parentNode.innerHTML = '<iframe class="Image--lazyLoad" data-src=' + iframe.getAttribute('data-src') + ' frameborder="0" allowfullscreen>';

        event.target.removeEventListener('transitionend', this._resetVideoListener);
      }

      /**
       * Some forms needs to be open inside a modal, and on page reload we must make sure to properly open the modal again
       */

    }, {
      key: '_checkOpenByHash',
      value: function _checkOpenByHash() {
        var hash = window.location.hash,
            modal = document.getElementById(hash.replace('#', ''));

        if (modal && modal.classList.contains('Modal')) {
          this._openModal(modal);
        }
      }

      /**
       * Handle a11y events
       */

    }, {
      key: '_handleKeyboard',
      value: function _handleKeyboard(event) {
        if (null !== this.activeModal && event.keyCode === 27) {
          this._closeModal();
        }
      }
    }]);

    return Modal;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = Modal;

  /***/
},
/* 26 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /**
   * This class will coordinate all the transitions from the website
   */

  var PageTransition = function () {
    _createClass(PageTransition, null, [{
      key: 'getInstance',
      value: function getInstance() {
        if (!this.instance) {
          this.instance = new PageTransition();
        }

        return this.instance;
      }
    }]);

    function PageTransition() {
      _classCallCheck(this, PageTransition);

      this.domDelegate = new domDelegate.Delegate(document.body);
      this.pageTransition = document.querySelector('.PageTransition');

      this._attachListeners();
    }

    _createClass(PageTransition, [{
      key: '_attachListeners',
      value: function _attachListeners() {
        this.domDelegate.on('click', 'a[href]:not([href^="#"]):not([href^="javascript:"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])', this._onPageUnload.bind(this));
      }

      /**
       * This callback captures click and transition from one page to another by doing a transition
       */

    }, {
      key: '_onPageUnload',
      value: function _onPageUnload(event, target) {
        var _this21 = this;

        if (event.defaultPrevented || event.ctrlKey || event.metaKey || !window.theme.showPageTransition || !this.pageTransition) {
          return;
        }

        event.preventDefault(); // Prevent the click to happen

        if (window.theme.showPageTransition && this.pageTransition) {
          var doTransition = function doTransition(event) {
            // Animation is finished, we can transition
            if (event.propertyName === 'opacity') {
              _this21.pageTransition.removeEventListener('transitionend', doTransition);
              window.location.href = target.href;
            }
          };

          this.pageTransition.addEventListener('transitionend', doTransition);

          this.pageTransition.style.visibility = 'visible';
          this.pageTransition.style.opacity = '1';
        }
      }
    }]);

    return PageTransition;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = PageTransition;

  /***/
},
/* 27 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Drawer__ = __webpack_require__(6);

  /**
   * Handle the store availability management. The parameter is the div that will hold the content. The function
   * "updateWithVariant" must be called whenever the variant is changed.
   */

  var StoreAvailability = function () {
    function StoreAvailability(element, productTitle) {
      _classCallCheck(this, StoreAvailability);

      this.element = element;
      this.productTitle = productTitle;
    }

    _createClass(StoreAvailability, [{
      key: 'updateWithVariant',
      value: function updateWithVariant(variant) {
        if (!this.element) {
          return; // If the element to inject the store availability does not exist, we return immediately
        }

        // If the variant is null (for instance unavailable variant), we clear the container
        if (!variant) {
          this.element.textContent = '';
          return;
        }

        // If we have a new variant we render the section
        this._renderAvailabilitySection(variant['id']);
      }
    }, {
      key: '_renderAvailabilitySection',
      value: function _renderAvailabilitySection(id) {
        var _this22 = this;

        // First we clear the previous content
        this.element.innerHTML = '';

        // If there is already an element with the given modal we remove it first
        var availabilityModal = document.getElementById('StoreAvailabilityModal-' + id);
        if (availabilityModal) {
          availabilityModal.remove();
        }

        return fetch(window.routes.rootUrlWithoutSlash + '/variants/' + id + '?section_id=store-availability').then(function (response) {
          return response.text().then(function (content) {
            _this22.element.innerHTML = content;
            _this22.element.innerHTML = _this22.element.firstElementChild.innerHTML;

            // The product title is not rendered so we have to render it manually
            var productTitle = _this22.element.querySelector('.store-availabilities-modal__product-title');

            if (productTitle) {
              productTitle.textContent = _this22.productTitle;
            }

            // In order for our modal system to work we have to append the modal to the body instead
            var availabilityModal = document.getElementById('StoreAvailabilityModal-' + id);
            document.body.appendChild(availabilityModal);

            // Create the drawer
            new __WEBPACK_IMPORTED_MODULE_0__components_Drawer__["default"](availabilityModal);
          });
        });
      }
    }]);

    return StoreAvailability;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = StoreAvailability;

  /***/
},
/* 28 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__ = __webpack_require__(5);

  var SearchBar = function () {
    function SearchBar() {
      _classCallCheck(this, SearchBar);

      this.documentDelegate = new domDelegate.Delegate(document.body);

      this.searchElement = document.getElementById('Search');
      this.searchInputElement = this.searchElement.querySelector('[name="q"]');
      this.searchResultsElement = this.searchElement.querySelector('.Search__Results');
      this.queryMap = {};
      this.isOpen = false;

      this.pageOverlayElement = document.querySelector('.PageOverlay');

      this._attachListeners();
    }

    _createClass(SearchBar, [{
      key: 'destroy',
      value: function destroy() {
        this.searchInputElement.removeEventListener('keydown', this._preventSubmissionListener);
        this.searchInputElement.removeEventListener('input', this._onInputListener);

        this.documentDelegate.off();
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._preventSubmissionListener = this._preventSubmission.bind(this);
        this._onInputListener = this._debounce(this._onInput.bind(this), 250);

        this.searchInputElement.addEventListener('keydown', this._preventSubmissionListener);
        this.searchInputElement.addEventListener('input', this._onInputListener);

        this.documentDelegate.on('click', '[data-action="toggle-search"]', this._toggleSearch.bind(this));
        this.documentDelegate.on('click', '[data-action="open-search"]', this._openSearch.bind(this));
        this.documentDelegate.on('click', '[data-action="close-search"]', this._closeSearch.bind(this));

        this.documentDelegate.on('search:close', this._closeSearch.bind(this)); // Allow for third-party elements to close the bar
      }

      /**
       * Toggle the search
       */

    }, {
      key: '_toggleSearch',
      value: function _toggleSearch(event) {
        if (this.isOpen) {
          this._closeSearch(event);
        } else {
          this._openSearch(event);
        }

        event.preventDefault();
      }

      /**
       * Open the search form and trap focus
       */

    }, {
      key: '_openSearch',
      value: function _openSearch() {
        var _this23 = this;

        this.searchElement.setAttribute('aria-hidden', 'false');

        document.documentElement.classList.add('no-scroll');
        __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].trapFocus(this.searchElement, 'search', this.searchElement.querySelector('[name="q"]'));

        var onFocusListener = function onFocusListener() {
          _this23.searchInputElement.focus();
          _this23.searchElement.removeEventListener('transitionend', onFocusListener);
        };

        this.searchElement.addEventListener('transitionend', onFocusListener);
        this.isOpen = true;

        this.pageOverlayElement.classList.add('is-visible');
        document.querySelector('.shopify-section--header').style.zIndex = 10;
      }

      /**
       * Close the search form and clear focus
       */

    }, {
      key: '_closeSearch',
      value: function _closeSearch() {
        var _this24 = this;

        this.searchElement.setAttribute('aria-hidden', 'true');

        document.documentElement.classList.remove('no-scroll');
        __WEBPACK_IMPORTED_MODULE_0__helper_Accessibility__["default"].removeTrapFocus(this.searchElement, 'search');

        this.isOpen = false;

        var onTransitionEnd = function onTransitionEnd(event) {
          if (event.propertyName === 'visibility') {
            document.querySelector('.shopify-section--header').style.zIndex = '';
            _this24.pageOverlayElement.removeEventListener('transitionend', onTransitionEnd);
          }
        };

        this.pageOverlayElement.addEventListener('transitionend', onTransitionEnd);
        this.pageOverlayElement.classList.remove('is-visible');
      }

      /**
       * In order to prevent an odd UX where hitting the enter always choose the product results, if the search is set to product + something else,
       * then we disable submission using enter key
       */

    }, {
      key: '_preventSubmission',
      value: function _preventSubmission(event) {
        if (event.keyCode === 13 && window.theme.searchMode !== 'product') {
          event.preventDefault();
        }
      }

      /**
       * This is called when the user has stopped typing (after debounce delay)
       */

    }, {
      key: '_onInput',
      value: function _onInput(event) {
        var _this25 = this;

        if (event.keyCode === 13) {
          return;
        }

        // Unfortunately, fetch does not support as of today cancelling a request. As a consequence what we do is that we manually
        // keep track of sent requests, and only use the results of the last one
        this.lastInputValue = event.target.value;

        if (this.lastInputValue === '') {
          this._resetSearch();
          return;
        }

        var queryOptions = { method: 'GET', credentials: 'same-origin' };

        var queries = [fetch(window.routes.searchUrl + '?view=ajax&q=' + encodeURIComponent(this.lastInputValue) + '*&type=product', queryOptions)];

        
        if (window.theme.searchMode !== 'product') {
          queries.push(fetch(window.routes.searchUrl + '?view=ajax&q=' + encodeURIComponent(this.lastInputValue) + '*&type=' + window.theme.searchMode.replace('product,', ''), queryOptions));
        }

        this.queryMap[this.lastInputValue] = true;

        document.dispatchEvent(new CustomEvent('theme:loading:start'));

        Promise.all(queries).then(function (responses) {
          // If we receive the result for a query that is not the last one, we simply do not process the result
          if (_this25.lastInputValue !== event.target.value) {
            return;
          }

          delete _this25.queryMap[event.target.value];

          Promise.all(responses.map(function (response) {
            return response.text();
          })).then(function (contents) {
            // If we have only one content then we only have product, otherwise we have products and articles
            if (window.theme.searchMode === 'product') {
              _this25.searchResultsElement.innerHTML = contents[0];
            } else {
              _this25.searchResultsElement.innerHTML = '<div class="PageLayout PageLayout--breakLap">\n              <div class="PageLayout__Section">' + contents[0] + '</div>\n              <div class="PageLayout__Section PageLayout__Section--secondary">' + contents[1] + '</div>\n            </div>';
            }

            _this25.searchResultsElement.setAttribute('aria-hidden', 'false');
          });

          document.dispatchEvent(new CustomEvent('theme:loading:end'));
        });
      }
    }, {
      key: '_resetSearch',
      value: function _resetSearch() {
        if (window.theme.searchMode === 'product') {
          this.searchResultsElement.innerHTML = '';
        } else {
          this.searchResultsElement.innerHTML = '<div class="PageLayout PageLayout--breakLap">\n              <div class="PageLayout__Section"></div>\n              <div class="PageLayout__Section PageLayout__Section--secondary"></div>\n            </div>';
        }

        this.searchResultsElement.setAttribute('aria-hidden', 'true');

        document.dispatchEvent(new CustomEvent('theme:loading:end')); // Just in case
      }

      /**
       * Simple function that allows to debounce
       */

    }, {
      key: '_debounce',
      value: function _debounce(fn, delay) {
        var _this26 = this;

        var timer = null;

        return function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          clearTimeout(timer);

          timer = setTimeout(function () {
            fn.apply(_this26, args);
          }, delay);
        };
      }
    }]);

    return SearchBar;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = SearchBar;

  /***/
},
/* 29 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper__ = __webpack_require__(10);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_CountrySelector__ = __webpack_require__(12);

  var AddressesSection = function AddressesSection() {
    var _this27 = this;

    _classCallCheck(this, AddressesSection);

    this.countrySelectors = [];

    __WEBPACK_IMPORTED_MODULE_0__helper__["DomHelper"].nodeListToArray(document.querySelectorAll('.Modal--address')).forEach(function (modal) {
      _this27.countrySelectors.push(new __WEBPACK_IMPORTED_MODULE_1__components_CountrySelector__["default"](modal.querySelector('[name="address[country]"]'), modal.querySelector('[name="address[province]"]')));
    });
  };
  /* harmony export (immutable) */

  __webpack_exports__["default"] = AddressesSection;

  /***/
},
/* 30 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);

  var ArticleList = function () {
    function ArticleList(container) {
      var _this28 = this;

      _classCallCheck(this, ArticleList);

      this.element = container;

      if (window.theme.showElementStaggering) {
        this.timeline = new TimelineLite({ delay: window.theme.showPageTransition ? 0.5 : 0 });

        this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this));

        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.ArticleItem')).forEach(function (item) {
          _this28.intersectionObserver.observe(item);
        });
      }
    }

    _createClass(ArticleList, [{
      key: 'onUnload',
      value: function onUnload() {
        if (window.theme.showElementStaggering) {
          this.intersectionObserver.disconnect();
          this.timeline.kill();
        }
      }
    }, {
      key: '_reveal',
      value: function _reveal(results) {
        var _this29 = this;

        var toReveal = [];

        results.forEach(function (result) {
          if (result.isIntersecting || result.intersectionRatio > 0) {
            // isIntersecting does not exist on Samsung Android browser
            toReveal.push(result.target);
            _this29.intersectionObserver.unobserve(result.target);
          }
        });

        if (toReveal.length === 0) {
          return;
        }

        this.timeline.staggerFromTo(toReveal, 0.45, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0 }, 0.2);
      }
    }]);

    return ArticleList;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ArticleList;

  /***/
},
/* 31 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);

  var ArticleSection = function () {
    function ArticleSection(container) {
      var _this30 = this;

      _classCallCheck(this, ArticleSection);

      this.element = container;
      this.toolbarElement = this.element.querySelector('.ArticleToolbar');
      this.articleNavElement = this.element.querySelector('.ArticleNav');

      var articleImageElement = this.element.querySelector('.Article__Image');

      if (articleImageElement && window.matchMedia('(-moz-touch-enabled: 0), (hover: hover)').matches) {
        this.parallaxInstance = new Rellax('.Article__Image', {
          speed: -7,
          center: false,
          round: true
        });
      }

      if (window.theme.showElementStaggering) {
        this.timeline = new TimelineLite({ delay: window.theme.showPageTransition ? 0.5 : 0 });
        this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this));

        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.ArticleItem')).forEach(function (item) {
          _this30.intersectionObserver.observe(item);
        });
      }

      this._attachListeners();
    }

    _createClass(ArticleSection, [{
      key: 'onUnload',
      value: function onUnload() {
        if (this.parallaxInstance) {
          this.parallaxInstance.destroy();
        }

        if (window.theme.showElementStaggering) {
          this.intersectionObserver.disconnect();
          this.timeline.kill();
        }

        window.removeEventListener('scroll', this._onScrollListener);
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._onScrollListener = this._checkToolbarVisibility.bind(this);
        window.addEventListener('scroll', this._onScrollListener);
      }
    }, {
      key: '_checkToolbarVisibility',
      value: function _checkToolbarVisibility() {
        var _this31 = this;

        var lastYPosition = 0,
            headerHeight = 0,
            navBottom = 0,
            isFixedHeader = 0,
            header = document.querySelector('.Header');

        fastdom.measure(function () {
          lastYPosition = window.pageYOffset;
          headerHeight = header.offsetHeight;
          isFixedHeader = parseInt(window.getComputedStyle(document.body).getPropertyValue('--use-sticky-header') || 0);

          if (_this31.articleNavElement) {
            navBottom = _this31.articleNavElement.offsetTop + _this31.articleNavElement.clientHeight - headerHeight;
          }
        });

        fastdom.mutate(function () {
          _this31.toolbarElement.style.top = isFixedHeader ? headerHeight + 'px' : null;

          if (_this31.articleNavElement) {
            if (lastYPosition > 150 && _this31.articleNavElement && lastYPosition < navBottom) {
              _this31.toolbarElement.classList.add('is-visible');
            } else {
              _this31.toolbarElement.classList.remove('is-visible');
            }
          } else {
            if (lastYPosition > 150) {
              _this31.toolbarElement.classList.add('is-visible');
            } else {
              _this31.toolbarElement.classList.remove('is-visible');
            }
          }
        });
      }
    }, {
      key: '_reveal',
      value: function _reveal(results) {
        var _this32 = this;

        var toReveal = [];

        results.forEach(function (result) {
          if (result.isIntersecting || result.intersectionRatio > 0) {
            // isIntersecting does not exist on Samsung Android browser
            toReveal.push(result.target);
            _this32.intersectionObserver.unobserve(result.target);
          }
        });

        if (toReveal.length === 0) {
          return;
        }

        this.timeline.staggerFromTo(toReveal, 0.45, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0 }, 0.2);
      }
    }]);

    return ArticleSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ArticleSection;

  /***/
},
/* 32 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var BackgroundVideoSection = function () {
    function BackgroundVideoSection(container) {
      _classCallCheck(this, BackgroundVideoSection);

      this.element = container;
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

      this._loadScript().then(this._setupPlayer.bind(this));
    }

    _createClass(BackgroundVideoSection, [{
      key: '_loadScript',
      value: function _loadScript() {
        var _this33 = this;

        return new Promise(function (resolve, reject) {
          var script = document.createElement('script');
          document.body.appendChild(script);
          script.onload = resolve;
          script.onerror = reject;
          script.async = true;
          script.src = _this33.options['videoType'] === 'youtube' ? '//www.youtube.com/iframe_api' : '//player.vimeo.com/api/player.js';
        });
      }
    }, {
      key: 'onUnload',
      value: function onUnload() {
        if (this.player) {
          this.player.destroy(); // Both YouTube and Vimeo use the same function name
        }
      }
    }, {
      key: '_setupPlayer',
      value: function _setupPlayer() {
        var _this34 = this;

        var elementToInsert = this.element.querySelector('.ImageHero__VideoHolder');

        var playerLoadingInterval = setInterval(function () {
          if (_this34.options['videoType'] === 'youtube') {
            if (window.YT) {
              _this34.player = new YT.Player(elementToInsert, {
                videoId: _this34.options['videoId'],
                playerVars: {
                  showinfo: 0,
                  controls: 0,
                  fs: 0,
                  rel: 0,
                  height: '100%',
                  width: '100%',
                  iv_load_policy: 3,
                  html5: 1,
                  loop: 1,
                  playsinline: 1,
                  modestbranding: 1,
                  disablekb: 1,
                  origin: _this34.options['requestHost']
                },
                events: {
                  onReady: _this34._onYouTubeReady.bind(_this34),
                  onStateChange: _this34._onYouTubeStateChange.bind(_this34)
                }
              });

              clearInterval(playerLoadingInterval);
            }
          } else {
            if (window.Vimeo) {
              _this34.player = new Vimeo.Player(elementToInsert.parentNode, {
                id: _this34.options['videoId'],
                autoplay: true,
                autopause: false,
                muted: true,
                background: true,
                /*height: '100%',
                width: '100%',*/
                loop: true
              });

              clearInterval(playerLoadingInterval);
            }
          }
        }, 50);
      }
    }, {
      key: '_onYouTubeReady',
      value: function _onYouTubeReady(event) {
        this.player.mute();
        this.player.playVideo();
      }
    }, {
      key: '_onYouTubeStateChange',
      value: function _onYouTubeStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
          this.player.playVideo();
        }
      }
    }]);

    return BackgroundVideoSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = BackgroundVideoSection;

  /***/
},
/* 33 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Drawer__ = __webpack_require__(6);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__components_ShippingEstimator__ = __webpack_require__(20);

  var CartSection = function () {
    function CartSection(container) {
      _classCallCheck(this, CartSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.documentDelegate = new domDelegate.Delegate(document.documentElement);
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));
      this.itemCount = this.options['itemCount'];
      this.isCartNoteOpen = false;

      if (this.options['drawer']) {
        this.sidebarDrawer = new __WEBPACK_IMPORTED_MODULE_0__components_Drawer__["default"](this.element, {
          onOpen: function() {
            
            setTimeout(function() {
              document.querySelector(".Drawer__Upsell .swiper").swiper.update();
            }, 1000);
          },
          onClose: this._onDrawerClosed.bind(this)
        });
      }

      if (this.options['hasShippingEstimator']) {
        this.shippingEstimator = new __WEBPACK_IMPORTED_MODULE_2__components_ShippingEstimator__["default"](this.element.querySelector('.ShippingEstimator'));
      }

      this._attachListeners();
    }

    _createClass(CartSection, [{
      key: 'onUnload',
      value: function onUnload() {
        if (this.options['hasShippingEstimator']) {
          this.shippingEstimator.destroy();
        }

        this.delegateElement.off();
        document.removeEventListener('product:added', this._onProductAddedListener);
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._onProductAddedListener = this._onProductAdded.bind(this);

        this.delegateElement.on('change', '#cart-note', this._updateCartNote.bind(this));

        if (this.options['type'] !== 'page') {
          this.delegateElement.on('click', '[data-action="update-item-quantity"], [data-action="remove-item"]', this._updateItemQuantity.bind(this));
          this.delegateElement.on('change', '.QuantitySelector__CurrentQuantity', this._updateItemQuantity.bind(this));
        } else {
          this.delegateElement.on('change', '.QuantitySelector__CurrentQuantity', this._reloadPageWithQuantity.bind(this));
        }

        // We have some listeners that are specific to the fact it's a drawer or the dedicated cart page
        if (this.options['drawer']) {
          this.delegateElement.on('click', '[data-action="toggle-cart-note"]', this._toggleCartNote.bind(this));
        }

        document.addEventListener('product:added', this._onProductAddedListener);

        // We attach a listener at page level which allows to re-render the cart
        this.documentDelegate.on('cart:refresh', this._rerenderCart.bind(this, false));
        
        this.documentDelegate.on('cart:open', this._onProductAdded.bind(this, false));
      }
    }, {
      key: '_updateCartNote',
      value: function _updateCartNote(event, target) {
        fetch(window.routes.cartUrl + '/update.js', {
          body: JSON.stringify({ note: target.value }),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
          }
        });
      }
    }, {
      key: '_toggleCartNote',
      value: function _toggleCartNote() {
        var _this35 = this;

        var noteContainer = this.element.querySelector('.Cart__OffscreenNoteContainer'),
            cartNote = this.element.querySelector('#cart-note');

        this.element.classList.toggle('has-note-open');
        this.element.querySelector('.Cart__NoteButton').innerHTML = cartNote.value !== '' ? window.languages.cartEditNote : window.languages.cartAddNote;

        noteContainer.setAttribute('aria-hidden', noteContainer.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');

        this.isCartNoteOpen = noteContainer.getAttribute('aria-hidden') === 'false';

        if (this.element.classList.contains('has-note-open')) {
          var transitionEndListener = function transitionEndListener() {
            _this35.element.querySelector('#cart-note').focus();
            noteContainer.removeEventListener('transitionend', transitionEndListener);
          };

          noteContainer.addEventListener('transitionend', transitionEndListener);
        }
      }
    }, {
      key: '_updateItemQuantity',
      value: function _updateItemQuantity(event, target) {
        var _this36 = this;

        document.dispatchEvent(new CustomEvent('theme:loading:start'));

        var quantity = null,
            elementToAnimate = null;

        if (target.tagName === 'INPUT') {
          quantity = parseInt(Math.max(parseInt(target.value) || 1, 1));
        } else {
          quantity = parseInt(target.getAttribute('data-quantity'));
        }

        // If the quantity is 0, then we will animate the product with a removal effect
        if (quantity === 0) {
          elementToAnimate = target.closest('.CartItemWrapper');
        }

        fetch(window.routes.cartChangeUrl + '.js', {
          body: JSON.stringify({ line: target.getAttribute('data-line'), quantity: quantity }),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
          }
        }).then(function (cart) {
          cart.json().then(function (content) {
            _this36.itemCount = content['item_count'];
            _this36._rerenderCart(elementToAnimate);

            document.dispatchEvent(new CustomEvent('theme:loading:end'));
          });
        });

        event.preventDefault();
      }
    }, {
      key: '_reloadPageWithQuantity',
      value: function _reloadPageWithQuantity(event, target) {
        window.location.href = window.routes.cartChangeUrl + '?quantity=' + parseInt(target.value) + '&line=' + target.getAttribute('data-line');
      }
    }, {
      key: '_onProductAdded',
      value: function _onProductAdded(event) {
        var _this37 = this;

        if(event) {
        this.itemCount += event.detail.quantity;
        }

        this._rerenderCart().then(function () {
          _this37.sidebarDrawer.open();
        });
      }
    }, {
      key: '_onDrawerClosed',
      value: function _onDrawerClosed() {
        if (this.isCartNoteOpen) {
          this._toggleCartNote();
        }
      }

      /**
       * This method is called internally to rerender the cart, based on the content returned by Shopify Ajax API.
       * We could save some performance by updating directly in JavaScript instead of doing a GET call to get the HTML
       * from Shopify, but by experience, this allows for easier app integration as it allows the Liquid to re-run
       * all the time and hence having easier logic.
       */

    }, {
      key: '_rerenderCart',
      value: function _rerenderCart(elementToAnimate) {
        var _this38 = this;

        
        // Note: appending a timestamp is necessary as the polyfill on IE11 and lower does not support the "cache" property
        return fetch(window.routes.cartUrl + '?view=' + (this.options['drawer'] && window.theme.pageType !== 'cart' ? 'drawer' : 'ajax') + '&timestamp=' + Date.now(), {
          credentials: 'same-origin',
          method: 'GET'
        }).then(function (content) {



          
   
          
          // If there is an element to animate, we animate it using a transition
          if (_this38.options['drawer'] && elementToAnimate) {
        //console.log("--------");
            var timelineLite = new TimelineLite({ onComplete: function onComplete() {
                content.text().then(function (html) {
                  _this38._replaceContent(html);
                  if(document.querySelector(".Cart__ShippingNotice .Drawer__Container")) {
                    document.querySelector(".Cart__ShippingNotice .Drawer__Container").insertAdjacentHTML('beforeend', window.languages.cartMessage);
                  }

          
                });
              } });

            timelineLite.to(elementToAnimate, 0.5, { height: 0, opacity: 0, ease: Cubic.easeOut }, 0);

            if (_this38.itemCount === 0) {
              timelineLite.to(_this38.element.querySelector('.Drawer__Footer'), 0.5, { y: '100%', transition: 'none', ease: Cubic.easeInOut }, 0);
            }
          } else {
            content.text().then(function (html) {
              _this38._replaceContent(html);
                  if(document.querySelector(".Cart__ShippingNotice .Drawer__Container")) {
                    document.querySelector(".Cart__ShippingNotice .Drawer__Container").insertAdjacentHTML('beforeend', window.languages.cartMessage);
                  }

            });
          }


          
        });
        
      }
    }, {
      key: '_replaceContent',
      value: function _replaceContent(html) {
        var _this39 = this;

        var tempElement = document.createElement('div');
        tempElement.innerHTML = html;

        var cartNodeParent = this.element.querySelector('.Cart').parentNode;

        if (this.options['drawer'] && window.theme.pageType !== 'cart') {
          var currentScrollPosition = this.element.querySelector('.Drawer__Main').scrollTop;
          cartNodeParent.replaceChild(tempElement.querySelector('.Cart'), this.element.querySelector('.Cart'));
          this.element.querySelector('.Drawer__Main').scrollTop = currentScrollPosition;
        } else {
          // For dedicated page we replace the whole section if there is no more product
          if (this.itemCount === 0) {
            this.element.innerHTML = tempElement.querySelector('.shopify-section').firstElementChild.innerHTML;
          } else {
            cartNodeParent.replaceChild(tempElement.querySelector('.Cart'), this.element.querySelector('.Cart'));
            this.element.querySelector('.PageHeader').innerHTML = tempElement.querySelector('.PageHeader').innerHTML;
          }
        }

        // We can also update the dot and the quantity
        var cartResult = JSON.parse(tempElement.querySelector('[data-section-type="cart"]').getAttribute('data-section-settings'));

        var cartDot = __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].nodeListToArray(document.querySelectorAll('.Header__CartDot')),
            cartQuantity = __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].nodeListToArray(document.querySelectorAll('.Header__CartCount'));

        this.itemCount = cartResult['itemCount'];

        cartDot.forEach(function (item) {
          if (_this39.itemCount === 0) {
            item.classList.remove('is-visible'); // IE 11 and lower does not support second attribute of toggle :(
          } else {
            item.classList.add('is-visible');
          }
        });

        cartQuantity.forEach(function (item) {
          item.textContent = _this39.itemCount;
        });
        
      
        let selector = `.Drawer__Upsell .swiper`;
        if(document.querySelector(selector)) {
          new Swiper(selector, JSON.parse(document.querySelector(selector).dataset.config));
        }

        // !!!!!!!!!!!!!
        const calculateShipping = function() {
          const info_container = document.querySelector("[data-information]");
          const target = info_container.querySelector("[data-amount]");
          const rate = Number(Shopify.currency.rate);
          const currency = (Shopify.currency.active === "USD")? "$": "€";
          let formatString = theme.moneyFormat.indexOf("{amount_with_comma_separator}}") > -1 ? "{amount_with_comma_separator}}" : "{amount}}" ;
          
          const cart_data = JSON.parse(info_container.dataset.information);
          let threshold = Math.round(cart_data.threshold / 100 * rate);
          let total = cart_data.total / 100;
          
          if(info_container && target) {
            info_container.style.setProperty('--element_width', (total/threshold*100) + '%');
            if(threshold > total) {
              target.innerHTML = theme.moneyFormat.replace(/\{.*\}/g, Math.round(threshold - total));
            } else {
              target.parentElement.innerHTML = "You are eligible for free shipping!";
            }
          }
        }

        if(document.querySelector(".shipping-information")) {
          calculateShipping();
        }
        

        let landingUTM = Cookies.get("landing_page_utm");
        let form = document.querySelector(".Cart");
        
        if(landingUTM) {
          console.log("Update checkout parameters");
          //form.setAttribute("action", form.getAttribute("action") + landingUTM);
        }
      }
    }]);

    return CartSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = CartSection;

  /***/
},
/* 34 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);

  var CollectionListSection = function () {
    function CollectionListSection(container) {
      _classCallCheck(this, CollectionListSection);

      this.element = container;

      var collectionListElement = this.element.querySelector('[data-flickity-config]');

      if (collectionListElement) {
        this.carousel = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](collectionListElement);
      }
    }

    _createClass(CollectionListSection, [{
      key: 'onUnload',
      value: function onUnload() {
        if (this.carousel) {
          this.carousel.destroy();
        }
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        if (this.carousel) {
          this.carousel.selectCell(event.target.getAttribute('data-slide-index'), true, !event.detail.load);
        }
      }
    }, {
      key: 'onBlockDeselect',
      value: function onBlockDeselect() {
        if (this.carousel) {
          this.carousel.unpausePlayer();
        }
      }
    }]);

    return CollectionListSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = CollectionListSection;

  /***/
},
/* 35 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Drawer__ = __webpack_require__(6);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_Popover__ = __webpack_require__(3);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__components_ProductItemColorSwatch__ = __webpack_require__(4);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__helper_Responsive__ = __webpack_require__(1);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__components_OverflowScroller__ = __webpack_require__(13);

  var CollectionSection = function () {
    function CollectionSection(element) {
      _classCallCheck(this, CollectionSection);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.toolbarElement = this.element.querySelector('.CollectionToolbar');
      this.collectionInnerElement = this.element.querySelector('.CollectionInner__Products');

      this.settings = JSON.parse(this.element.getAttribute('data-section-settings'));
      this.currentTags = this.settings['currentTags'];
      this.currentSortBy = this.settings['sortBy'];

      this.temporaryTags = this.currentTags.slice(); // This allows to do a deep copy of the current tags

      // Create the popover if available
      var sortPopoverElement = document.getElementById('collection-sort-popover');
      if (sortPopoverElement) {
        this.sortPopover = new __WEBPACK_IMPORTED_MODULE_1__components_Popover__["default"](sortPopoverElement, { onValueChanged: this._sortByChanged.bind(this) });
      }

      // Create the filter drawer if available
      var filterDrawerElement = document.getElementById('collection-filter-drawer');

      if (filterDrawerElement) {
        this.filterDrawer = new __WEBPACK_IMPORTED_MODULE_0__components_Drawer__["default"](filterDrawerElement, { onClose: this._removeUncommittedTags.bind(this) });
      }

      // Create scroller of sidebar
      if (this.settings['filterPosition'] === 'sidebar') {
        this.filterInnerSidebarScroller = new __WEBPACK_IMPORTED_MODULE_5__components_OverflowScroller__["default"](this.element.querySelector('.CollectionInner__Sidebar'));
      }

      // Setup parallax on image (if any)
      var collectionImageElement = this.element.querySelector('.PageHeader__ImageWrapper');

      if (collectionImageElement && window.matchMedia('(-moz-touch-enabled: 0), (hover: hover)').matches) {
        this.parallaxInstance = new Rellax('.PageHeader__ImageWrapper', {
          speed: -7,
          center: false,
          round: true
        });
      }

      // Setup product item color swatch
      new __WEBPACK_IMPORTED_MODULE_2__components_ProductItemColorSwatch__["default"](this.element);

      // Setup animation
      this.timeline = new TimelineLite({ delay: window.theme.showPageTransition ? 0.5 : 0 });
      this._setupAnimation();

      this._attachListeners();
    }

    _createClass(CollectionSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.delegateElement.off('click');

        if (this.sortPopover) {
          this.sortPopover.destroy();
        }

        if (this.filterDrawer) {
          this.filterDrawer.destroy();
        }

        if (this.filterInnerSidebarScroller) {
          this.filterInnerSidebarScroller.destroy();
        }

        if (this.parallaxInstance) {
          this.parallaxInstance.destroy();
        }

        if (window.theme.showElementStaggering) {
          this.intersectionObserver.disconnect();
          this.timeline.kill();
        }
      }
    }, {
      key: '_setupAnimation',
      value: function _setupAnimation() {
        var _this40 = this;

        var forceLoadFromTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!window.theme.showElementStaggering) {
          return;
        }

        // If there is already an observer set up, we remove it first
        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
        }

        if (forceLoadFromTop) {
          this.timeline.staggerFromTo(this.element.querySelectorAll('.ProductList .ProductItem'), 0.45, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0 }, 0.2);
        } else {
          this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this), {
            threshold: 0.3
          });

          __WEBPACK_IMPORTED_MODULE_3__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.ProductList .ProductItem')).forEach(function (item) {
            _this40.intersectionObserver.observe(item);
          });
        }
      }
    }, {
      key: '_reveal',
      value: function _reveal(results) {
        var _this41 = this;

        var toReveal = [];

        results.forEach(function (result) {
          if (result.isIntersecting || result.intersectionRatio > 0) {
            // isIntersecting does not exist on Samsung Android browser
            toReveal.push(result.target);
            _this41.intersectionObserver.unobserve(result.target);
          }
        });

        if (toReveal.length === 0) {
          return;
        }

        this.timeline.staggerFromTo(toReveal, 0.45, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0 }, 0.2);
      }
    }, {
      key: '_changeLayoutMode',
      value: function _changeLayoutMode(event, target) {
        var _this42 = this;

        var layoutType = target.getAttribute('data-grid-type'),
            newCount = parseInt(target.getAttribute('data-count'));

        // Otherwise we detect the mode, and change all classes
        var productList = this.collectionInnerElement.querySelector('.ProductList');

        if (productList) {
          var previousCount = parseInt(productList.getAttribute('data-' + layoutType + '-count'));

          if (previousCount === newCount) {
            return; // Nothing has changed so we just return to avoid reflow
          }

          productList.setAttribute('data-' + layoutType + '-count', newCount);

          __WEBPACK_IMPORTED_MODULE_3__helper_Dom__["default"].nodeListToArray(productList.querySelectorAll('.Grid__Cell')).forEach(function (item) {
            if (layoutType === 'mobile') {
              item.classList.remove('1/' + previousCount + '--phone'); // IE11 and lower does not support classList.replace
              item.classList.add('1/' + newCount + '--phone');
            } else {
              var previousTabletCount = previousCount === 2 ? 2 : 3,
                  newTabletCount = newCount === 2 ? 2 : 3;

              if (_this42.settings['filterPosition'] === 'drawer') {
                item.classList.remove('1/' + previousCount + '--lap-and-up');
                item.classList.add('1/' + newCount + '--lap-and-up');
              } else {
                item.classList.remove('1/' + previousCount + '--desk');
                item.classList.add('1/' + newCount + '--desk');
              }

              item.classList.remove('1/' + previousTabletCount + '--tablet-and-up');
              item.classList.add('1/' + newTabletCount + '--tablet-and-up');
            }

            if (window.theme.showElementStaggering) {
              item.firstElementChild.style.visibility = 'hidden'; // Make it as hidden so we can re-trigger the animation
            }
          });

          // Force lazy sizes to recalculate item sizes
          lazySizes.autoSizer.checkElems();
        }

        target.classList.add('is-active');
        __WEBPACK_IMPORTED_MODULE_3__helper_Dom__["default"].getSiblings(target)[0].classList.remove('is-active');

        this._setupAnimation();

        // In order to prevent reflow and provide better user experience, we save into cart attributes (those are removed before the checkout
        // is submitted) the user choices so they are preserved on page reload, without the need to use JavaScript

        fetch(window.routes.cartUrl + '/update.js', {
          body: JSON.stringify({
            attributes: _defineProperty({}, 'collection_' + layoutType + '_items_per_row', newCount)
          }),
          credentials: 'same-origin',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' // This is needed as currently there is a bug in Shopify that assumes this header
          }
        });
      }
    }, {
      key: '_sortByChanged',
      value: function _sortByChanged(sortBy) {
        if (this.currentSortBy === sortBy) {
          return;
        }

        this.currentSortBy = sortBy;
        this._reloadProducts();
      }
    }, {
      key: '_toggleTag',
      value: function _toggleTag(event) {
        var element = event.target;

        if (element.classList.contains('is-active')) {
          this.temporaryTags.splice(this.temporaryTags.indexOf(element.getAttribute('data-tag')), 1); // Delete the tag if already active
        } else {
          var activeSibling = element.closest('.Collapsible').querySelector('.is-active');

          if (activeSibling) {
            this.temporaryTags.splice(this.temporaryTags.indexOf(activeSibling.getAttribute('data-tag')), 1);
          }

          this.temporaryTags.push(element.getAttribute('data-tag')); // Add if not previously active
        }

        this._updateActiveTags();

        // If we have the mode set as "sidebar" and that we are on desktop, we auto-commit
        if (__WEBPACK_IMPORTED_MODULE_4__helper_Responsive__["default"].matchesBreakpoint('lap-and-up') && this.settings['filterPosition'] === 'sidebar') {
          this._commit();
        }
      }
    }, {
      key: '_removeUncommittedTags',
      value: function _removeUncommittedTags() {
        this.temporaryTags = this.currentTags.slice(); // We simply reset the temporary tags to the active tags
        this._updateActiveTags();
      }
    }, {
      key: '_applyTags',
      value: function _applyTags() {
        this._updateActiveTags();
        this._commit();
      }
    }, {
      key: '_resetTags',
      value: function _resetTags() {
        this.temporaryTags = []; // We simply remove all tags
        this._applyTags();
      }
    }, {
      key: '_updateActiveTags',
      value: function _updateActiveTags() {
        var _this43 = this;

        __WEBPACK_IMPORTED_MODULE_3__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.CollectionFilters [data-tag]')).forEach(function (item) {
          // IE11 and lower does not support classList.toggle...
          if (_this43.temporaryTags.includes(item.getAttribute('data-tag'))) {
            item.classList.add('is-active');
            item.parentNode.classList.add('is-selected'); // For the case of "ListItem"
          } else {
            item.classList.remove('is-active');
            item.parentNode.classList.remove('is-selected'); // For the case of "ListItem"
          }
        });
      }
    }, {
      key: '_commit',
      value: function _commit() {
        var _this44 = this;

        if (this.currentTags.sort().join(',') !== this.temporaryTags.sort().join(',')) {
          this.currentTags = this.temporaryTags.slice();
          this._reloadProducts();
        }

        if (this.filterDrawer.isOpen) {
          this.filterDrawer.close();
        }

        __WEBPACK_IMPORTED_MODULE_3__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('[data-action="reset-tags"]')).forEach(function (resetButton) {
          resetButton.style.display = _this44.currentTags.length === 0 ? 'none' : 'block';
        });
      }
    }, {
      key: '_reloadProducts',
      value: function _reloadProducts() {
        var _this45 = this;

        document.dispatchEvent(new CustomEvent('theme:loading:start'));

        var filterElement = this.toolbarElement.querySelector('.CollectionToolbar__Item--filter');

        if (filterElement) {
          var filterElementCount = filterElement.querySelector('span');

          if (filterElementCount) {
            filterElement.removeChild(filterElementCount);
          }

          if (this.currentTags.length === 0) {
            filterElement.classList.add('Text--subdued');
          } else {
            filterElement.classList.remove('Text--subdued');
            filterElement.innerHTML += '<span class="Text--subdued">(' + this.currentTags.length + ')</span>';
          }
        }

        // We also rewrite the URL if browser supports it
        if (history.replaceState) {
          var tags = this.currentTags.length > 0 ? this.currentTags.join('+') : '';
          var newUrl = window.location.protocol + '//' + window.location.host + this.settings['collectionUrl'] + '/' + tags + '?sort_by=' + this.currentSortBy;

          window.history.pushState({ path: newUrl }, '', newUrl);
        }

        var formData = new FormData();
        formData.append('view', 'ajax');
        formData.append('sort_by', this.currentSortBy);

        fetch(location.pathname + '?view=ajax&sort_by=' + this.currentSortBy, {
          credentials: 'same-origin',
          method: 'GET'
        }).then(function (response) {
          response.text().then(function (content) {
            var tempElement = document.createElement('div');
            tempElement.innerHTML = content;

            _this45.collectionInnerElement.innerHTML = tempElement.querySelector('.shopify-section').innerHTML;
            document.dispatchEvent(new CustomEvent('theme:loading:end'));

            _this45._setupAnimation(true);

            // We scroll to the top
            var elementOffset = _this45.element.querySelector('.CollectionMain').getBoundingClientRect().top - parseInt(document.documentElement.style.getPropertyValue('--header-height'));

            if (__WEBPACK_IMPORTED_MODULE_4__helper_Responsive__["default"].matchesBreakpoint('lap-and-up') && _this45.toolbarElement && _this45.toolbarElement.clientHeight === 0) {
              elementOffset -= 50;
            }

            if (elementOffset < 0) {
              window.scrollBy({ top: elementOffset, behavior: 'smooth' });
            }
          });
        });
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._toggleTagListener = this._toggleTag.bind(this);
        this._applyTagsListener = this._applyTags.bind(this);
        this._resetTagsListener = this._resetTags.bind(this);
        this._changeLayoutModeListener = this._changeLayoutMode.bind(this);

        this.delegateElement.on('click', '[data-action="toggle-tag"]', this._toggleTagListener);
        this.delegateElement.on('click', '[data-action="apply-tags"]', this._applyTagsListener);
        this.delegateElement.on('click', '[data-action="reset-tags"]', this._resetTagsListener);
        this.delegateElement.on('click', '[data-action="change-layout-mode"]', this._changeLayoutModeListener);

        window.addEventListener('popstate', function (event) {
          if (event.state.path) {
            window.location.href = event.state.path;
          }
        });
      }
    }]);

    return CollectionSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = CollectionSection;

  /***/
},
/* 36 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Animation__ = __webpack_require__(7);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Dom__ = __webpack_require__(0);

  var FaqSection = function () {
    function FaqSection(element) {
      _classCallCheck(this, FaqSection);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);

      this._attachListeners();
    }

    _createClass(FaqSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.delegateElement.off();
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        this._openItem(event.target);
      }
    }, {
      key: 'onBlockDeselect',
      value: function onBlockDeselect(event) {
        this._closeItem(event.target);
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '.Faq__Question', this._toggleItem.bind(this));
        this.delegateElement.on('click', '.FaqSummary__Item', this._switchToCategory.bind(this));
      }
    }, {
      key: '_switchToCategory',
      value: function _switchToCategory(event, target) {
        target.classList.add('is-active');

        __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].getSiblings(target, '.is-active').forEach(function (item) {
          item.classList.remove('is-active');
        });
      }
    }, {
      key: '_toggleItem',
      value: function _toggleItem(event, target) {
        var item = target.closest('.Faq__Item');

        if (item.getAttribute('aria-expanded') === 'true') {
          this._closeItem(item);
        } else {
          this._openItem(item);
        }
      }
    }, {
      key: '_openItem',
      value: function _openItem(item) {
        var answerWrapper = item.querySelector('.Faq__AnswerWrapper');

        item.setAttribute('aria-expanded', 'true');

        answerWrapper.setAttribute('aria-hidden', 'false');
        __WEBPACK_IMPORTED_MODULE_0__helper_Animation__["default"].slideDown(answerWrapper, true);

        __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].getSiblings(item, '[aria-expanded="true"]').forEach(function (siblingItem) {
          var siblingAnswerWrapper = siblingItem.querySelector('.Faq__AnswerWrapper');

          siblingItem.setAttribute('aria-expanded', 'false');

          siblingAnswerWrapper.setAttribute('aria-hidden', 'true');
          __WEBPACK_IMPORTED_MODULE_0__helper_Animation__["default"].slideUp(siblingAnswerWrapper);
        });
      }
    }, {
      key: '_closeItem',
      value: function _closeItem(item) {
        var answerWrapper = item.querySelector('.Faq__AnswerWrapper');

        item.setAttribute('aria-expanded', 'false');
        answerWrapper.setAttribute('aria-hidden', 'true');
        __WEBPACK_IMPORTED_MODULE_0__helper_Animation__["default"].slideUp(answerWrapper);
      }
    }]);

    return FaqSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = FaqSection;

  /***/
},
/* 37 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__ = __webpack_require__(4);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__helper__ = __webpack_require__(10);

  var FeaturedCollectionsSection = function () {
    function FeaturedCollectionsSection(container) {
      var _this46 = this;

      _classCallCheck(this, FeaturedCollectionsSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.options = JSON.parse(this.element.getAttribute('data-settings'));

      this.carousels = [];

      __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('[data-flickity-config]')).forEach(function (item) {
        _this46.carousels.push(new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](item));
      });

      // Setup product item color swatch
      new __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__["default"](this.element);

      this._setupAnimation();
      this._attachListeners();
    }

    _createClass(FeaturedCollectionsSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.carousels.forEach(function (item) {
          return item.destroy();
        });
        this.delegateElement.off('click');

        this.intersectionObserver.disconnect();
        this.timeline.kill();
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        // We simply trigger a click on the element that controls this tab
        this.element.querySelector('[aria-controls="' + event.target.id + '"]').click();
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '[data-action="toggle-tab"]', this._switchTab.bind(this));
      }
    }, {
      key: '_switchTab',
      value: function _switchTab(event, target) {
        var _this47 = this;

        // If the tab is already active, do nothing
        if (target.classList.contains('is-active')) {
          return;
        }

        // First, switch the current tab
        target.classList.add('is-active');
        __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].getSiblings(target, '.is-active').forEach(function (item) {
          item.classList.remove('is-active');
        });

        // Then, display the panel
        var tabPanelToShow = this.element.querySelector('#' + target.getAttribute('aria-controls'));

        this.timeline.eventCallback('onReverseComplete', function () {
          tabPanelToShow.setAttribute('aria-hidden', 'false');

          __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].getSiblings(tabPanelToShow, '.TabPanel[aria-hidden="false"]').forEach(function (item) {
            item.setAttribute('aria-hidden', 'true');
          });

          if (__WEBPACK_IMPORTED_MODULE_3__helper__["ResponsiveHelper"].matchesBreakpoint('lap-and-up')) {
            _this47.carousels.forEach(function (carousel) {
              // There is a bug in Safari where it cannot detect the pseudo-element "::after" if the tab panel is hidden. As a consequence,
              // we manually activate it
              carousel.flickityInstance.activate();
              carousel.flickityInstance.resize(); // Ugly hack
            });
          }

          _this47.timeline.clear();
          _this47._setupAnimation();
        });

        if (this.options['layout'] === 'grid' && window.theme.showElementStaggering) {
          this.timeline.reverse().timeScale(3);
        } else {
          this.timeline.reverse();
        }
      }
    }, {
      key: '_setupAnimation',
      value: function _setupAnimation() {
        var _this48 = this;

        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
        }

        this.timeline = new TimelineLite({ delay: 0.5 });

        if (this.options['layout'] === 'grid' && window.theme.showElementStaggering) {
          this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this));

          __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.TabPanel[aria-hidden="false"] .ProductList .ProductItem')).forEach(function (item) {
            _this48.intersectionObserver.observe(item);
          });
        } else {
          var productList = this.element.querySelector('.TabPanel[aria-hidden="false"] .ProductList');

          if (productList) {
            this.timeline.fromTo(productList, 0.6, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0 });
          }
        }
      }
    }, {
      key: '_reveal',
      value: function _reveal(results) {
        var _this49 = this;

        var toReveal = [];

        results.forEach(function (result) {
          if (result.isIntersecting || result.intersectionRatio > 0) {
            // isIntersecting does not exist on Samsung Android browser
            toReveal.push(result.target);
            _this49.intersectionObserver.unobserve(result.target);
          }
        });

        if (toReveal.length === 0) {
          return;
        }

        this.timeline.staggerFromTo(toReveal, 0.45, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0 }, 0.2);
      }
    }]);

    return FeaturedCollectionsSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = FeaturedCollectionsSection;

  /***/
},
/* 38 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_ProductVariants__ = __webpack_require__(11);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Image__ = __webpack_require__(9);

  var FeaturedProductSection = function () {
    function FeaturedProductSection(container) {
      _classCallCheck(this, FeaturedProductSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

      if (!this.options['usePlaceholder'] && this.options['templateSuffix'] !== 'coming-soon') {
        this.productVariants = new __WEBPACK_IMPORTED_MODULE_0__components_ProductVariants__["default"](container, this.options);
      }

      // We have to re-order elements in the DOM
      var offscreenElement = this.element.querySelector('.Product__OffScreen');

      if (offscreenElement) {
        this.element.appendChild(offscreenElement);
      }

      this._attachListeners();
    }

    _createClass(FeaturedProductSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.delegateElement.off('click');

        if (this.productVariants) {
          this.productVariants.destroy();
        }
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('variant:changed', this._updateMainImage.bind(this));
      }

      /**
       * Update the main featured image
       */

    }, {
      key: '_updateMainImage',
      value: function _updateMainImage(event) {
        var variant = event.detail.variant,
            previousVariant = event.detail.previousVariant;

        if (!variant || !variant['featured_image'] || previousVariant['featured_image'] && previousVariant['featured_image']['id'] === variant['featured_image']['id']) {
          return;
        }

        // Otherwise we are on the home page. It's a bit more complex as we have to rewrite some code normally written in Liquid
        var newImage = variant['featured_image'];

        var mainImageContainer = this.element.querySelector('.FeaturedProduct__Gallery .AspectRatio');
        mainImageContainer.style.cssText = 'max-width: ' + newImage['width'] + 'px; --aspect-ratio: ' + newImage['width'] / newImage['height'];

        var newImageElement = document.createElement('img');
        newImageElement.classList.add('Image--lazyLoad');
        newImageElement.setAttribute('data-src', __WEBPACK_IMPORTED_MODULE_1__helper_Image__["default"].getSizedImageUrl(newImage['src'], '1x1').replace('_1x1.', '_{width}x.'));
        newImageElement.setAttribute('data-widths', '[' + __WEBPACK_IMPORTED_MODULE_1__helper_Image__["default"].getSupportedSizes(newImage, [200, 400, 600, 700, 800, 900, 1000]).join(',') + ']');
        newImageElement.setAttribute('data-sizes', 'auto');

        mainImageContainer.replaceChild(newImageElement, mainImageContainer.querySelector('img'));
      }
    }]);

    return FeaturedProductSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = FeaturedProductSection;

  /***/
},
/* 39 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Popover__ = __webpack_require__(3);

  var FooterSection = function () {
    function FooterSection(container) {
      _classCallCheck(this, FooterSection);

      this.element = container;

      var localePopoverElement = document.getElementById('footer-locale-popover');
      if (localePopoverElement) {
        this.localePopover = new __WEBPACK_IMPORTED_MODULE_0__components_Popover__["default"](localePopoverElement, { preferredAlignment: 'center', preferredPosition: 'top', threshold: 12 });
      }

      var currencyPopoverElement = document.getElementById('footer-currency-popover');
      if (currencyPopoverElement) {
        this.currencyPopover = new __WEBPACK_IMPORTED_MODULE_0__components_Popover__["default"](currencyPopoverElement, { preferredAlignment: 'center', preferredPosition: 'top', threshold: 12 });
      }
    }

    _createClass(FooterSection, [{
      key: 'onUnload',
      value: function onUnload() {
        if (this.localePopover) {
          this.localePopover.destroy();
        }

        if (this.currencyPopover) {
          this.currencyPopover.destroy();
        }
      }
    }]);

    return FooterSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = FooterSection;

  /***/
},
/* 40 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var GiftCardSection = function () {
    function GiftCardSection(container) {
      _classCallCheck(this, GiftCardSection);

      this.element = container;

      this._createQrCode();
      this._setupPrint();
    }

    _createClass(GiftCardSection, [{
      key: '_createQrCode',
      value: function _createQrCode() {
        var qrCodeElement = document.getElementById('QrCode');

        new QRCode(qrCodeElement, {
          text: qrCodeElement.getAttribute('data-identifier'),
          width: 120,
          height: 120
        });
      }
    }, {
      key: '_setupPrint',
      value: function _setupPrint() {
        var printElement = document.getElementById('PrintGiftCard');

        if (printElement) {
          printElement.addEventListener('click', function () {
            window.print();
          });
        }
      }
    }]);

    return GiftCardSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = GiftCardSection;

  /***/
},
/* 41 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Responsive__ = __webpack_require__(1);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__components_Popover__ = __webpack_require__(3);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__components__ = __webpack_require__(21);

  var HeaderSection = function () {
    function HeaderSection(container) {
      var _this50 = this;

      _classCallCheck(this, HeaderSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));
      this.lastScrollPosition = -1;
      this.isTouch = window.matchMedia('(-moz-touch-enabled: 1), (hover: none)').matches;

      if (this.options['isSticky']) {
        Stickyfill.addOne(this.element.parentNode);
      }

      // Set up the search bar
      this.searchBar = new __WEBPACK_IMPORTED_MODULE_3__components__["SearchBar"]();

      this._attachListeners();
      this._verifyNavigationOverlap();

      // We set again some CSS variables that are used for some calculations in CSS
      var mainLogo = this.element.querySelector('.Header__LogoImage--primary');

      if (mainLogo && !mainLogo.complete) {
        mainLogo.addEventListener('load', function () {
          fastdom.measure(function () {
            document.documentElement.style.setProperty('--header-height', _this50.element.clientHeight + 'px');
            document.documentElement.style.setProperty('--header-is-not-transparent', _this50.options['hasTransparentHeader'] ? 0 : 1);
          });
        });
      } else {
        fastdom.measure(function () {
          document.documentElement.style.setProperty('--header-height', _this50.element.clientHeight + 'px');
          document.documentElement.style.setProperty('--header-is-not-transparent', _this50.options['hasTransparentHeader'] ? 0 : 1);
        });
      }

      this._setupLocalizationPopovers();
    }

    _createClass(HeaderSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.element.removeEventListener('mouseleave', this._closeNavigationListener);
        this.element.removeEventListener('mouseenter', this._focusNavigationListener);
        this.element.removeEventListener('focusin', this._focusNavigationListener);

        this.delegateElement.off();

        window.removeEventListener('scroll', this._checkTransparentHeaderListener);
        window.removeEventListener('resize', this._verifyNavigationOverlapListener);

        if (this.options['isSticky']) {
          Stickyfill.removeOne(this.element.parentNode);
        }

        this.searchBar.destroy();

        this.localizationPopovers.forEach(function (localizationPopover) {
          localizationPopover.destroy();
        });
      }
    }, {
      key: 'onSelect',
      value: function onSelect() {
        this._checkTransparentHeader();
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        var _this51 = this;

        var listItem = event.target.closest('.HorizontalList__Item');

        fastdom.mutate(function () {
          event.target.setAttribute('aria-hidden', 'false');

          if (listItem) {
            listItem.classList.add('is-expanded');

            __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].getSiblings(listItem, '.is-expanded').forEach(function (item) {
              item.classList.remove('is-expanded');
            });
          }

          _this51.element.classList.remove('Header--transparent'); // This is needed to make sure everything is visible
        });
      }
    }, {
      key: 'onBlockDeselect',
      value: function onBlockDeselect(event) {
        var listItem = event.target.closest('.HorizontalList__Item');

        fastdom.mutate(function () {
          event.target.setAttribute('aria-hidden', 'true');

          if (listItem) {
            listItem.classList.remove('is-expanded');
          }
        });

        this._checkTransparentHeader();
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._checkTransparentHeaderListener = this._checkTransparentHeader.bind(this);
        this._closeNavigationListener = this._closeNavigation.bind(this);
        this._focusNavigationListener = this._focusNavigation.bind(this);
        this._verifyNavigationOverlapListener = this._verifyNavigationOverlap.bind(this);

        this.element.addEventListener('mouseleave', this._closeNavigationListener);

        this.delegateElement.on('mouseenter', '.Header__MainNav .HorizontalList__Item, [aria-haspopup]', this._openMenu.bind(this), true);
        this.delegateElement.on('focusin', '[aria-haspopup]', this._openMenu.bind(this), true);
        this.delegateElement.on('focusout', '[aria-haspopup]', this._closeMenu.bind(this), false);
        this.delegateElement.on('click', '[data-action="toggle-search"]', this._closeNavigationListener);
        this.delegateElement.on('mouseleave', '.DropdownMenu [aria-haspopup]', this._closeMenu.bind(this), true);
        this.delegateElement.on('mouseenter', '.DropdownMenu [aria-haspopup]', this._adjustDropdownPosition.bind(this), true);
        
        if (this.isTouch) {
          this.delegateElement.on('click', '.Header__MainNav [aria-haspopup]', this._handleTouchMenu.bind(this));
        }

        if (this.options['hasTransparentHeader']) {
          this.element.addEventListener('mouseenter', this._focusNavigationListener);
          this.element.addEventListener('focusin', this._focusNavigationListener);
        }

        if (this.options['isSticky'] && this.options['hasTransparentHeader']) {
          window.addEventListener('scroll', this._checkTransparentHeaderListener);
        }

        if (this.options['navigationStyle'] === 'inline' || this.options['navigationStyle'] === 'logoLeft') {
          window.addEventListener('resize', this._verifyNavigationOverlapListener);
        }
      }
    }, {
      key: '_setupLocalizationPopovers',
      value: function _setupLocalizationPopovers() {
        // Prestige is an extremely complex theme, especially in the header due to the various layouts that power different
        // features. One issue that arises with this is that we output the localization elements twice in the DOM (with the
        // same ID as we're doing a capture in Liquid), and then depending on the screen size one layout is choosen. We therefore
        // have to de-duplicate the ID here. This is honestly not the cleanest code on earth, but I prefer handling this here
        // rather than duplicating too much Liquid
        this.localizationPopovers = [];

        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(document.querySelectorAll('#header-locale-popover')).forEach(function (item, index) {
          item.id = item.id + '-' + index;
        });
        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(document.querySelectorAll('[aria-controls="header-locale-popover"]')).forEach(function (item, index) {
          item.setAttribute('aria-controls', item.getAttribute('aria-controls') + '-' + index);
        });

        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(document.querySelectorAll('#header-currency-popover')).forEach(function (item, index) {
          item.id = item.id + '-' + index;
        });
        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(document.querySelectorAll('[aria-controls="header-currency-popover"]')).forEach(function (item, index) {
          item.setAttribute('aria-controls', item.getAttribute('aria-controls') + '-' + index);
        });

        var localePopoverElement1 = document.getElementById('header-locale-popover-0');
        if (localePopoverElement1) {
          this.localizationPopovers.push(new __WEBPACK_IMPORTED_MODULE_2__components_Popover__["default"](localePopoverElement1, { preferredAlignment: 'center', preferredPosition: 'bottom', threshold: 12 }));
        }
        var localePopoverElement2 = document.getElementById('header-locale-popover-1');
        if (localePopoverElement2) {
          this.localizationPopovers.push(new __WEBPACK_IMPORTED_MODULE_2__components_Popover__["default"](localePopoverElement2, { preferredAlignment: 'center', preferredPosition: 'bottom', threshold: 12 }));
        }

        var currencyPopoverElement1 = document.getElementById('header-currency-popover-0');
        if (currencyPopoverElement1) {
          this.localizationPopovers.push(new __WEBPACK_IMPORTED_MODULE_2__components_Popover__["default"](currencyPopoverElement1, { preferredAlignment: 'center', preferredPosition: 'bottom', threshold: 12 }));
        }
        var currencyPopoverElement2 = document.getElementById('header-currency-popover-1');
        if (currencyPopoverElement2) {
          this.localizationPopovers.push(new __WEBPACK_IMPORTED_MODULE_2__components_Popover__["default"](currencyPopoverElement2, { preferredAlignment: 'center', preferredPosition: 'bottom', threshold: 12 }));
        }
      }
    }, {
      key: '_focusNavigation',
      value: function _focusNavigation() {
        var _this52 = this;


        fastdom.mutate(function () {
          if (!_this52.isTouch || __WEBPACK_IMPORTED_MODULE_1__helper_Responsive__["default"].matchesBreakpoint('desk')) {
            //_this52.element.classList.remove('Header--transparent');
          }
        });
      }
    }, {
      key: '_closeNavigation',
      value: function _closeNavigation() {
        var _this53 = this;

        fastdom.mutate(function () {
          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(_this53.element.querySelectorAll('.is-expanded')).forEach(function (item) {
            item.classList.remove('is-expanded');
          });

          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(_this53.element.querySelectorAll('.Header__MainNav [aria-hidden="false"]')).forEach(function (item) {
            item.setAttribute('aria-hidden', 'true');
          });
        });

        if (this.options['hasTransparentHeader']) {
          this._checkTransparentHeader();
        }
      }
    }, {
      key: '_openMenu',
      value: function _openMenu(event, target) {
        if (event.type === 'mouseenter' && target !== event.target) {
          return;
        }

        
        fastdom.mutate(function () {
          target.classList.add('is-expanded');
          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(target.children, '.Header__MainNav [aria-hidden="true"]').forEach(function (item) {
            item.setAttribute('aria-hidden', 'false');
          });

          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].getSiblings(target, '.is-expanded').forEach(function (item) {
            item.classList.remove('is-expanded');

            __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(item.children, '.Header__MainNav [aria-hidden="false"]').forEach(function (item) {
              item.setAttribute('aria-hidden', 'true');
            });
          });
        });
      }
    }, {
      key: '_closeMenu',
      value: function _closeMenu(event, target) {
        if (event.type === 'mouseleave' && target !== event.target) {
          return;
        }

        fastdom.mutate(function () {
          target.classList.remove('is-expanded');

          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(target.children, '.Header__MainNav [aria-hidden="false"]').forEach(function (item) {
            item.setAttribute('aria-hidden', 'true');
          });
        });
      }
    }, {
      key: '_adjustDropdownPosition',
      value: function _adjustDropdownPosition(event, target) {
        var nestedMenus = __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(target.querySelectorAll('.DropdownMenu')),
            shouldOpenLeft = false;

        fastdom.measure(function () {
          var windowWidth = window.innerWidth,
              rightEdge = target.getBoundingClientRect().right;

          nestedMenus.forEach(function (item) {
            if (rightEdge + item.offsetWidth > windowWidth) {
              shouldOpenLeft = true;
            }
          });
        });

        fastdom.mutate(function () {
          if (shouldOpenLeft) {
            nestedMenus.forEach(function (item) {
              item.classList.add('DropdownMenu--reversed');
            });
          } else {
            nestedMenus.forEach(function (item) {
              item.classList.remove('DropdownMenu--reversed');
            });
          }
        });
      }

      /**
       * On touch devices where we display the standard menu (like landscape iPad or Surface) we need to do additional code to properly
       * handle the opening of menu. Especially, what we do is that if an item has a sub-menu, a click does not follow the link but instead open
       * the sub-menu. If this link is clicked a second twice, then the menu is followed
       */

    }, {
      key: '_handleTouchMenu',
      value: function _handleTouchMenu(event, target) {
        if (!target.classList.contains('is-expanded')) {
          event.preventDefault();
        }
      }
    }, {
      key: '_verifyNavigationOverlap',
      value: function _verifyNavigationOverlap() {
        var _this54 = this;

        var isOverlapping = false;

        fastdom.measure(function () {
          // To detect if the navigation is overlapping, we take the height of a single item and check if its height is taller than the parent
          var mainTopMenu = _this54.element.querySelector('.Header__MainNav');

          if (mainTopMenu) {
            // Get the first element
            var firstNavElementHeight = __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].outerHeightWithMargin(mainTopMenu.querySelector('.HorizontalList__Item')),
                mainNavHeight = mainTopMenu.scrollHeight;

            if (mainNavHeight > firstNavElementHeight) {
              isOverlapping = true;
            }
          }
        });

        this.element.classList.remove('Header--logoLeft', 'Header--inline', 'Header--center');
        this.element.classList.add('Header--' + this.options['navigationStyle']);
        this.element.clientWidth; // Forces a reflow

        fastdom.mutate(function () {
          if (isOverlapping) {
            _this54.element.classList.remove('Header--' + _this54.options['navigationStyle']);
            _this54.element.classList.add('Header--center');
          } else {
            _this54.element.classList.add('Header--' + _this54.options['navigationStyle']);
            _this54.element.classList.remove('Header--center');
          }

          _this54.element.classList.add('Header--initialized');

          fastdom.measure(function () {
            document.documentElement.style.setProperty('--header-height', _this54.element.clientHeight + 'px');
          });
        });
      }

      /**
       * If the header mode is set to "transparent", we have to do extra work to automatically make it with fill colors when the
       * user starts scrolling. For performance we are using fastDOM to do that (which relies of requestAnimationFrame instead of
       * scroll listener)
       */

    }, {
      key: '_checkTransparentHeader',
      value: function _checkTransparentHeader() {
        var _this55 = this;

        if (!this.options['hasTransparentHeader']) {
          return;
        }

        var scrollThreshold = 10;

        fastdom.measure(function () {
          _this55.lastScrollPosition = window.pageYOffset;
        });

        fastdom.mutate(function () {
          if (_this55.lastScrollPosition <= scrollThreshold) {
            _this55.element.classList.add('Header--transparent');
          } else {
            _this55.element.classList.remove('Header--transparent');
          }
        });
      }
    }]);

    return HeaderSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = HeaderSection;

  /***/
},
/* 42 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var ImageWithTextBlockSection = function () {
    function ImageWithTextBlockSection(container) {
      _classCallCheck(this, ImageWithTextBlockSection);

      this.element = container;
    }

    _createClass(ImageWithTextBlockSection, [{
      key: 'onUnload',
      value: function onUnload() {}
    }]);

    return ImageWithTextBlockSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ImageWithTextBlockSection;

  /***/
},
/* 43 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var LoginSection = function () {
    function LoginSection(container) {
      _classCallCheck(this, LoginSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.timelineLite = new TimelineLite();

      this.customerLoginForm = this.element.querySelector('#customer_login');
      this.recoverPasswordForm = this.element.querySelector('#recover_customer_password');

      this.delegateElement.on('click', '[data-action="toggle-recover-form"]', this._showRecoverPassword.bind(this));
    }

    _createClass(LoginSection, [{
      key: '_showRecoverPassword',
      value: function _showRecoverPassword() {
        var isLoginActive = this.customerLoginForm.style.display === 'block';

        if (isLoginActive) {
          this.timelineLite.fromTo(this.customerLoginForm, 0.5, { autoAlpha: 1, display: 'block', y: 0 }, { autoAlpha: 0, y: 20, display: 'none' }).fromTo(this.recoverPasswordForm, 0.5, { autoAlpha: 0, display: 'none', y: 20 }, { autoAlpha: 1, display: 'block', y: 0, delay: 0.25 });
        } else {
          this.timelineLite.fromTo(this.recoverPasswordForm, 0.5, { autoAlpha: 1, display: 'block', y: 0 }, { autoAlpha: 0, y: 20, display: 'none' }).fromTo(this.customerLoginForm, 0.5, { autoAlpha: 0, display: 'none', y: 20 }, { autoAlpha: 1, display: 'block', y: 0, delay: 0.25 });
        }
      }
    }]);

    return LoginSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = LoginSection;

  /***/
},
/* 44 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var MapSection = function () {
    function MapSection(element) {
      _classCallCheck(this, MapSection);

      this.element = element;
      this.options = JSON.parse(element.getAttribute('data-section-settings'));

      if (this.options['apiKey'] && this.options['mapAddress']) {
        this._loadScript().then(this._initMap.bind(this));
      }
    }

    _createClass(MapSection, [{
      key: '_loadScript',
      value: function _loadScript() {
        var _this56 = this;

        return new Promise(function (resolve, reject) {
          var script = document.createElement('script');
          document.body.appendChild(script);
          script.onload = resolve;
          script.onerror = reject;
          script.async = true;
          script.src = 'https://maps.googleapis.com/maps/api/js?key=' + _this56.options['apiKey'];
        });
      }
    }, {
      key: '_initMap',
      value: function _initMap() {
        var _this57 = this;

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address: this.options['mapAddress'] }, function (results, status) {
          if (status !== google.maps.GeocoderStatus.OK) {
            if (Shopify.designMode) {}
          } else {
            var mapOptions = {
              zoom: _this57.options['zoom'],
              center: results[0].geometry.location,
              draggable: false,
              clickableIcons: false,
              scrollwheel: false,
              disableDoubleClickZoom: true,
              disableDefaultUI: true
            };

            var map = new google.maps.Map(_this57.element.querySelector('.FeaturedMap__GMap'), mapOptions),
                center = map.getCenter();

            map.setCenter(center);

            var icon = {
              path: "M32.7374478,5.617 C29.1154478,1.995 24.2994478,0 19.1774478,0 C14.0544478,0 9.23944778,1.995 5.61744778,5.617 C-1.08555222,12.319 -1.91855222,24.929 3.81344778,32.569 L19.1774478,54.757 L34.5184478,32.6 C40.2734478,24.929 39.4404478,12.319 32.7374478,5.617 Z M19.3544478,26 C15.4954478,26 12.3544478,22.859 12.3544478,19 C12.3544478,15.141 15.4954478,12 19.3544478,12 C23.2134478,12 26.3544478,15.141 26.3544478,19 C26.3544478,22.859 23.2134478,26 19.3544478,26 Z",
              fillColor: _this57.options['markerColor'],
              fillOpacity: 1,
              anchor: new google.maps.Point(15, 55),
              strokeWeight: 0,
              scale: 0.6
            };

            new google.maps.Marker({
              map: map,
              position: map.getCenter(),
              icon: icon
            });

            var styledMapType = new google.maps.StyledMapType(JSON.parse(_this57.element.querySelector('[data-gmap-style]').innerHTML));

            map.mapTypes.set('styled_map', styledMapType);
            map.setMapTypeId('styled_map');

            google.maps.event.addDomListener(window, 'resize', function () {
              google.maps.event.trigger(map, 'resize');
              map.setCenter(center);
            });
          }
        });
      }
    }]);

    return MapSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = MapSection;

  /***/
},
/* 45 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  var NewsletterPopupSection = function () {
    function NewsletterPopupSection(element) {
      _classCallCheck(this, NewsletterPopupSection);

      this.element = element;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.options = JSON.parse(element.getAttribute('data-section-settings'));

      // If the popup has been already displayed, we do not display it
      try {
        if (window.location.hash === '#newsletter-popup' && window.theme.pageType !== null) {
          this._openPopup();
        } else if (!this.options['showOnlyOnce'] || this.options['showOnlyOnce'] && localStorage.getItem('themePopup') === null) {
          setTimeout(this._openPopup.bind(this), this.options['apparitionDelay'] * 1000);
        }
      } catch (error) {
        // Some browsers (especially in private mode) throw an exception when trying to access local storage, so we protect ourselves here
      }

      this._attachListeners();
    }

    _createClass(NewsletterPopupSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.delegateElement.off();
      }
    }, {
      key: 'onSelect',
      value: function onSelect() {
        this._openPopup();
      }
    }, {
      key: 'onDeselect',
      value: function onDeselect() {
        this._closePopup();
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '[data-action="close-popup"]', this._closePopup.bind(this));
      }
    }, {
      key: '_openPopup',
      value: function _openPopup() {
        this.element.setAttribute('aria-hidden', 'false');
        localStorage.setItem('themePopup', 'true');
      }
    }, {
      key: '_closePopup',
      value: function _closePopup() {
        this.element.setAttribute('aria-hidden', 'true');
      }
    }]);

    return NewsletterPopupSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = NewsletterPopupSection;

  /***/
},
/* 46 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__ = __webpack_require__(4);

  var ProductRecommendationsSection = function () {
    function ProductRecommendationsSection(container) {
      _classCallCheck(this, ProductRecommendationsSection);

      this.element = container;
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

      if (this.options['useRecommendations']) {
        this._loadRecommendations().then(this._createSlideshow.bind(this));
      } else {
        this._createSlideshow();
      }
    }

    _createClass(ProductRecommendationsSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.carousel.destroy();
      }
    }, {
      key: '_loadRecommendations',
      value: function _loadRecommendations() {
        var _this58 = this;

        var url = window.routes.productRecommendationsUrl + '?section_id=product-recommendations&product_id=' + this.options['productId'] + '&limit=' + this.options['recommendationsCount'];

        return fetch(url).then(function (response) {
          return response.text().then(function (content) {
            var container = document.createElement('div');
            container.innerHTML = content;

            _this58.element.querySelector('.ProductRecommendations').innerHTML = container.querySelector('.ProductRecommendations').innerHTML;
          });
        });
      }
    }, {
      key: '_createSlideshow',
      value: function _createSlideshow() {
        this.carousel = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](this.element.querySelector('[data-flickity-config]'));

        // Setup product item color swatch
        new __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__["default"](this.element);
      }
    }]);

    return ProductRecommendationsSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductRecommendationsSection;

  /***/
},
/* 47 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_ProductModel__ = __webpack_require__(15);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__components_ProductVariants__ = __webpack_require__(11);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__components_ProductImageZoom__ = __webpack_require__(14);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__components_ProductReviews__ = __webpack_require__(16);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__components_ProductVideo__ = __webpack_require__(18);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_6__components_ScrollSpy__ = __webpack_require__(19);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_7__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_8__components_OverflowScroller__ = __webpack_require__(13);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_9__helper_Responsive__ = __webpack_require__(1);

  var ProductSection = function () {
    function ProductSection(container) {
      var _this59 = this;

      _classCallCheck(this, ProductSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

      this.viewInSpaceElement = this.element.querySelector('[data-shopify-xr]');

      if (this.options['templateSuffix'] !== 'coming-soon') {
        this.productVariants = new __WEBPACK_IMPORTED_MODULE_2__components_ProductVariants__["default"](container, this.options);
      }

      this.productReviews = new __WEBPACK_IMPORTED_MODULE_4__components_ProductReviews__["default"](container);

      var productSlideshowElement = this.element.querySelector('.Product__Slideshow');

      // If there is no image at all, there is nothing to init
      if (productSlideshowElement) {
        this.productSlideshow = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](productSlideshowElement, { onSelect: this._onImageChanged.bind(this), onSettle: this._onImageSettled.bind(this) }, { draggable: !__WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].matchesBreakpoint('supports-hover') });
        this.mediaList = {}; // We keep track of a list of media element
        this.previouslySelectedMedia = null; // Keep track of the previously selected media

        // For each model and video, we register a media
        productSlideshowElement.querySelectorAll('[data-media-type="model"]').forEach(function (model) {
          _this59.mediaList[model.getAttribute('data-media-id')] = new __WEBPACK_IMPORTED_MODULE_1__components_ProductModel__["default"](model, _this59.options['stackProductImages']);
        });

        productSlideshowElement.querySelectorAll('[data-media-type="video"], [data-media-type="external_video"]').forEach(function (video) {
          _this59.mediaList[video.getAttribute('data-media-id')] = new __WEBPACK_IMPORTED_MODULE_5__components_ProductVideo__["default"](video, _this59.options['stackProductImages'], _this59.options['enableVideoLooping']);
        });

        if (this.options['stackProductImages']) {
          this.slideshowNavDots = this.element.querySelector('.Product__SlideshowNav--dots');
          this.slideshowNavDotsItems = this.slideshowNavDots ? __WEBPACK_IMPORTED_MODULE_7__helper_Dom__["default"].nodeListToArray(this.slideshowNavDots.querySelectorAll('a')) : [];
        }

        if (this.options['showThumbnails']) {
          this.slideshowNavThumbnails = this.element.querySelector('.Product__SlideshowNav--thumbnails');
          this.slideshowNavThumbnailsItems = this.slideshowNavThumbnails ? __WEBPACK_IMPORTED_MODULE_7__helper_Dom__["default"].nodeListToArray(this.slideshowNavThumbnails.querySelectorAll('.Product__SlideshowNavImage')) : [];
        }

        this.slideshowImages = __WEBPACK_IMPORTED_MODULE_7__helper_Dom__["default"].nodeListToArray(productSlideshowElement.querySelectorAll('.Carousel__Cell'));

        // Setup the mobile nav
        this._setupSlideshowMobileNav();
      }

      this.productWrapperElement = this.element.querySelector('.Product__Wrapper');
      this.productInfoElement = this.element.querySelector('.Product__Info');
      this.productAsideElement = this.element.querySelector('.Product__Aside');
      this.productGalleryElement = this.element.querySelector('.Product__Gallery');
      this.quickNav = this.element.querySelector('.Product__QuickNav');

      if (this.options['enableImageZoom']) {
        this.imageZoomInstance = new __WEBPACK_IMPORTED_MODULE_3__components_ProductImageZoom__["default"](this.element, this.productSlideshow);
      }

      Stickyfill.addOne(this.productInfoElement);

      // We have to re-order elements in the DOM
      var offscreenElement = this.element.querySelector('.Product__OffScreen');

      if (offscreenElement) {
        this.element.appendChild(offscreenElement);
      }

      this._setupDeviceFeatures();
      this._attachListeners();
    }

    _createClass(ProductSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.delegateElement.off('click');
        this.productReviews.destroy();

        if (this.productVariants) {
          this.productVariants.destroy();
        }

        if (this.productSlideshow) {
          this.productSlideshow.destroy();
        }

        if (this.options['enableImageZoom']) {
          this.imageZoomInstance.destroy();
        }

        if (this.carouselNavScrollSpy) {
          this.carouselNavScrollSpy.destroy();
        }

        if (this.quickNav) {
          window.removeEventListener('scroll', this._checkQuickNavListener);
        }

        if (this.productInfoScroller) {
          this.productInfoScroller.destroy();
        }

        if (this.productThumbnailsScroller) {
          this.productThumbnailsScroller.destroy();
        }

        if (window.ResizeObserver && this.productInfoResizeObserver) {
          this.productInfoResizeObserver.disconnect();
        }

        Stickyfill.removeOne(this.productInfoElement);

        document.removeEventListener('breakpoint:changed', this._onBreakpointChangedListener);
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._onBreakpointChangedListener = this._setupDeviceFeatures.bind(this);
        this._checkQuickNavListener = this._checkQuickNav.bind(this);

        this.delegateElement.on('click', '[data-action="toggle-social-share"]', this._toggleSocialShare.bind(this));
        this.delegateElement.on('variant:changed', this._updateSlideshowImage.bind(this));
        this.delegateElement.on('scrollspy:target:changed', this._onScrollTargetChanged.bind(this));

        this.delegateElement.on('model:played', this._onMediaPlayed.bind(this));
        this.delegateElement.on('video:played', this._onMediaPlayed.bind(this));

        this.delegateElement.on('model:paused', this._onMediaPaused.bind(this));
        this.delegateElement.on('video:paused', this._onMediaPaused.bind(this));

        document.addEventListener('breakpoint:changed', this._onBreakpointChangedListener);

        if (this.quickNav) {
          window.addEventListener('scroll', this._checkQuickNavListener);
        }

        if (!this.options['stackProductImages'] && this.options['showThumbnails']) {
          this.delegateElement.on('click', '.Product__SlideshowNavImage', this._switchToImage.bind(this));
        }
      }
    }, {
      key: '_setupSlideshowMobileNav',
      value: function _setupSlideshowMobileNav() {
        var _this60 = this;

        this.slideshowMobileNav = this.element.querySelector('.Product__SlideshowMobileNav');

        if (this.slideshowMobileNav) {
          var slideshowMobileNavDelegate = new domDelegate.Delegate(this.slideshowMobileNav);

          // Handle the dot
          slideshowMobileNavDelegate.on('click', '.dot', function (event, element) {
            _this60._slideWillChange();
            _this60.productSlideshow.selectCell(parseInt(element.getAttribute('data-index')));
          });

          // Handle the buttons
          slideshowMobileNavDelegate.on('click', '.Product__SlideshowNavArrow', function (event, element) {
            _this60._slideWillChange();

            if (element.getAttribute('data-direction') === 'next') {
              _this60.productSlideshow.next();
            } else {
              _this60.productSlideshow.previous();
            }
          });
        }
      }

      /**
       * Update the main carousel image
       */

    }, {
      key: '_updateSlideshowImage',
      value: function _updateSlideshowImage(event) {
        var variant = event.detail.variant,
            previousVariant = event.detail.previousVariant;

        if (!variant || !variant['featured_media'] || previousVariant && previousVariant['featured_media'] && previousVariant['featured_media']['id'] === variant['featured_media']['id']) {
          return;
        }

        // We have two logic here: if we are on pocket mode, we switch using the carousel, otherwise we simulate a link to the anchor
        this._slideWillChange();

        if (__WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].matchesBreakpoint('pocket') || !this.options['stackProductImages']) {
          for (var i = 0; i !== this.productSlideshow.flickityInstance.cells.length; ++i) {
            var cellElement = this.productSlideshow.flickityInstance.cells[i].element,
                mediaId = parseInt(cellElement.getAttribute('data-media-id'));

            if (mediaId === variant['featured_media']['id']) {
              this.productSlideshow.selectCell(parseInt(cellElement.getAttribute('data-media-position')) - 1);
            }
          }
        } else {
          document.querySelector('[href="#Media' + variant['featured_media']['id'] + '"]').click();
          //document.getElementById(`Media${variant['featured_media']['id']}`).scrollIntoView({behavior: 'smooth'});
        }
      }

      /**
       * This happens when a media is played
       */

    }, {
      key: '_onMediaPlayed',
      value: function _onMediaPlayed(event) {
        // Remove draggability
        this.productSlideshow.getFlickityInstance().options.draggable = false;
        this.productSlideshow.getFlickityInstance().unbindDrag();

        // If there is a previously enabled media, we disable it
        if (this.previouslySelectedMedia && this.previouslySelectedMedia !== event.target) {
          this.mediaList[this.previouslySelectedMedia.getAttribute('data-media-id')].hasBeenDeselected();
        }

        // If the slideshow is configured to stack images, the "select" method from the carousel is not called, so we
        // have to keep track of it here
        if (this.options['stackProductImages']) {
          this.previouslySelectedMedia = event.target;
        }
      }

      /**
       * This happens when a given media is paused
       */

    }, {
      key: '_onMediaPaused',
      value: function _onMediaPaused() {
        // Enable draggability
        this.productSlideshow.getFlickityInstance().options.draggable = !__WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].matchesBreakpoint('supports-hover');
        this.productSlideshow.getFlickityInstance().bindDrag();
      }

      /**
       * This method is called when a media changed in the slideshow
       */

    }, {
      key: '_handleMedia',
      value: function _handleMedia(item) {
        // First, we need to turn off the previous media (if any)
        if (this.previouslySelectedMedia && this.previouslySelectedMedia !== item) {
          switch (this.previouslySelectedMedia.getAttribute('data-media-type')) {
            case 'video':
            case 'external_video':
            case 'model':
              this.mediaList[this.previouslySelectedMedia.getAttribute('data-media-id')].hasBeenDeselected();
          }

          // If the previous media was a model, we need to adjust the "view in space" button to go back to initial value
          if (this.previouslySelectedMedia.getAttribute('data-media-type') === 'model' && this.viewInSpaceElement) {
            this.viewInSpaceElement.setAttribute('data-shopify-model3d-id', this.viewInSpaceElement.getAttribute('data-shopify-model3d-default-id'));
          }
        }

        // Then, we have to handle the currently selected media
        switch (item.getAttribute('data-media-type')) {
          case 'video':
          case 'external_video':
          case 'model':
            this.mediaList[item.getAttribute('data-media-id')].hasBeenSelected();
            break;
        }

        // If the media is a model, we need to adjust the "view in space" button
        if (item.getAttribute('data-media-type') === 'model' && this.viewInSpaceElement) {
          this.viewInSpaceElement.setAttribute('data-shopify-model3d-id', item.getAttribute('data-media-id'));
        }

        // We set the previously selected media to the currently new one, so that when it changes it can be properly accounted
        this.previouslySelectedMedia = item;
      }

      /**
       * Callback when the target changes
       */

    }, {
      key: '_onScrollTargetChanged',
      value: function _onScrollTargetChanged(event) {
        // The scrollspy emit also an "oldTarget", but when scrolling very fast with Firefox or Safari, it prevents the old to be removed, so we
        // manually iterate through all of them to remove it first
        if (this.options['stackProductImages']) {
          this.slideshowNavDotsItems.forEach(function (item) {
            return item.classList.remove('is-selected');
          });
          this.slideshowNavDotsItems[parseInt(event.detail.newTarget.getAttribute('data-media-position')) - 1].classList.add('is-selected');

          if (this.options['showThumbnails']) {
            this.slideshowNavThumbnailsItems.forEach(function (item) {
              return item.classList.remove('is-selected');
            });
            this.slideshowNavThumbnailsItems[parseInt(event.detail.newTarget.getAttribute('data-media-position')) - 1].classList.add('is-selected');
          }
        }
      }
    }, {
      key: '_switchToImage',
      value: function _switchToImage(event, target) {
        event.preventDefault();

        
        this._slideWillChange();

        for (var i = 0; i !== this.productSlideshow.flickityInstance.cells.length; ++i) {
          var cellElement = this.productSlideshow.flickityInstance.cells[i].element,
              mediaId = parseInt(cellElement.getAttribute('data-media-id'));
          if (mediaId === parseInt(target.getAttribute('data-media-id'))) {
            this.productSlideshow.selectCell(parseInt(cellElement.getAttribute('data-media-position')) - 1);
          }
        }
      }

      /**
       * Check the quick nav
       */

    }, {
      key: '_checkQuickNav',
      value: function _checkQuickNav() {
//         var _this61 = this;

//         var showAsideQuickNav = false;

//         fastdom.measure(function () {
//           showAsideQuickNav = window.scrollY >= _this61.productAsideElement.offsetTop - _this61.productAsideElement.clientHeight;
//         });

//         fastdom.mutate(function () {
//           if (showAsideQuickNav) {
//             _this61.quickNav.classList.add('is-flipped');
//           } else {
//             _this61.quickNav.classList.remove('is-flipped');
//           }
//         });
      }

      /**
       * Toggle the social share icons
       */

    }, {
      key: '_toggleSocialShare',
      value: function _toggleSocialShare(event, target) {
        target.classList.toggle('is-active');
        target.classList.toggle('RoundButton--secondaryState');

        target.setAttribute('aria-expanded', target.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        target.nextElementSibling.setAttribute('aria-hidden', target.nextElementSibling.getAttribute('aria-hidden') === 'true' ? 'false' : 'true');
      }
    }, {
      key: '_onImageChanged',
      value: function _onImageChanged(event, cell) {

        // If cell is video or model, we hide the action list
        if (__WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].matchesBreakpoint('pocket')) {
          var productGalleryActionListElement = this.element.querySelector('.Product__Gallery .Product__ActionList');

          if (productGalleryActionListElement) {
            if (cell.classList.contains('Product__SlideItem--image')) {
              productGalleryActionListElement.classList.remove('is-hidden');
            } else {
              productGalleryActionListElement.classList.add('is-hidden');
            }
          }
        }
        
        window.swiper.slideTo(event, 300, function() {
          
        })	
        
        // If we have non-stacked with thumbnails, update it
        if (!this.options['stackProductImages'] && this.options['showThumbnails']) {
          var mediaId = cell.getAttribute('data-media-id');

          this.slideshowNavThumbnailsItems.forEach(function (thumbnail) {
            if (thumbnail.getAttribute('data-media-id') === mediaId) {
              thumbnail.classList.add('is-selected');
            } else {
              thumbnail.classList.remove('is-selected');
            }
          });
        }

        // If we have the mobile navigation, we also update it
        if (this.slideshowMobileNav) {
          var selectedIndex = parseInt(cell.getAttribute('data-media-position')) - 1; // The -1 is to make it 0 indexed

          console.log(cell.getAttribute('data-media-position'), selectedIndex);
          __WEBPACK_IMPORTED_MODULE_7__helper_Dom__["default"].nodeListToArray(this.slideshowMobileNav.querySelectorAll('.dot')).forEach(function (item, index) {
    
            if (index === selectedIndex) {
              item.classList.add('is-selected');
            } else {
              item.classList.remove('is-selected');
            }
          });
        }
      }
    }, {
      key: '_onImageSettled',
      value: function _onImageSettled(index, cell) {
        this._handleMedia(cell);

        if (__WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].matchesBreakpoint('lap-and-up')) {
          var slides = this.element.querySelectorAll('.Product__SlideItem:not(.is-selected)');
          slides.forEach(function (slide) {
            slide.classList.add('Product__SlideItem--hidden');
          });
        }
      }
    }, {
      key: '_slideWillChange',
      value: function _slideWillChange() {
        if (__WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].matchesBreakpoint('lap-and-up')) {
          var slides = this.element.querySelectorAll('.Product__SlideItem');
          slides.forEach(function (slide) {
            slide.classList.remove('Product__SlideItem--hidden');
          });
        }
      }

      /**
       * Verify when the screen size changes to create additional stuff on non pocket mode
       */

    }, {
      key: '_setupDeviceFeatures',
      value: function _setupDeviceFeatures(event) {
        var _this62 = this;

        var currentBreakpoint = event ? event.detail.currentBreakpoint : __WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].getCurrentBreakpoint(),
            previousBreakpoint = event ? event.detail.previousBreakpoint : null;

        if (currentBreakpoint === previousBreakpoint) {
          return; // Nothing has changed, no specific setup to do
        }

        if (currentBreakpoint === 'phone' || currentBreakpoint === 'tablet') {
          if (this.carouselNavScrollSpy) {
            this.carouselNavScrollSpy.destroy();
          }

          if (this.productInfoScroller) {
            this.productInfoScroller.destroy();
          }

          if (this.productThumbnailsScroller) {
            this.productThumbnailsScroller.destroy();
          }

          if (this.productAsideElement) {
            this.productAsideElement.style.minHeight = null;
          } else {
            this.productWrapperElement.style.minHeight = null;
          }

          this.productInfoElement.parentNode.style.maxHeight = null;
        } else {
          // 1st: scrollspy for the dots and image
          if (this.slideshowImages && this.slideshowImages.length > 1) {
            var offsetTop = 0;

            if (this.options['stackProductImages'] && this.slideshowNavDots) {
              offsetTop = this.slideshowNavDots.firstElementChild.offsetTop;
            }

            if (this.options['showThumbnails'] && __WEBPACK_IMPORTED_MODULE_9__helper_Responsive__["default"].matchesBreakpoint('desk')) {
              offsetTop = 250;
            }

            this.carouselNavScrollSpy = new __WEBPACK_IMPORTED_MODULE_6__components_ScrollSpy__["default"](this.element, this.slideshowImages, {
              rootMargin: '-' + offsetTop + 'px 0px 0px 0px'
            });
          }

          var productInfoStyles = window.getComputedStyle(this.productInfoElement),
              productInfoPadding = parseInt(productInfoStyles.paddingTop) + parseInt(productInfoStyles.paddingBottom),
              productGalleryHeight = this.productGalleryElement ? parseInt(this.productGalleryElement.scrollHeight) : 0;

          // 2nd: making sure to set up enough space in aside part
          var calculateMinHeight = function calculateMinHeight() {
            if (_this62.productAsideElement) {
              _this62.productAsideElement.style.minHeight = _this62.productInfoElement.scrollHeight - productInfoPadding - productGalleryHeight + 'px';
              //_this62.productInfoElement.closest('.Product__InfoWrapper').style.maxHeight = _this62.productAsideElement.offsetTop + _this62.productInfoElement.scrollHeight - productInfoPadding + 'px';
            } else {
              _this62.productWrapperElement.style.minHeight = _this62.productInfoElement.scrollHeight - parseInt(productInfoStyles.paddingTop) + 'px';
            }
          };

          //calculateMinHeight();

          // This code actually works well, but if a merchant is using an app that dynamically adds content (such as ReCharge or any other widget-based app), this
          // will mess the min height. There is a clean solution to this issue, which is by using ResizeObserver. However it's only supported in Chrome for now,
          // but I feel it's already good to have a clean fix
          if (window.ResizeObserver) {
            this.productInfoResizeObserver = new ResizeObserver(function () {
              //calculateMinHeight(); // We currently do not take advantage of the values returned by the observer as our calculation depends on other values
            });

            this.productInfoResizeObserver.observe(this.productInfoElement);
          }

          // 3rd: let's handle the scroll for the product info
          this.productInfoScroller = new __WEBPACK_IMPORTED_MODULE_8__components_OverflowScroller__["default"](this.productInfoElement);

          // 4th: let's handle the scroll for the thumbnails
          if (this.options['showThumbnails'] && this.slideshowNavThumbnails) {
            this.productThumbnailsScroller = new __WEBPACK_IMPORTED_MODULE_8__components_OverflowScroller__["default"](this.slideshowNavThumbnails);
          }
        }
      }
    }]);

    return ProductSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ProductSection;

  /***/
},
/* 48 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__ = __webpack_require__(4);

  var RecentlyViewedProductsSection = function () {
    function RecentlyViewedProductsSection(container) {
      _classCallCheck(this, RecentlyViewedProductsSection);

      this.element = container;
      this.options = JSON.parse(this.element.getAttribute('data-section-settings'));

      if (this.options['productId']) {
        this._saveProduct(this.options['productId']);
      }

      // Setup product item color swatch
      new __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__["default"](this.element);

      this._fetchProducts();
    }

    _createClass(RecentlyViewedProductsSection, [{
      key: 'onUnload',
      value: function onUnload() {
        if (this.carousel) {
          this.carousel.destroy();
        }
      }

      /**
       * When we are on a product page, we need to save the current product into local storage
       */

    }, {
      key: '_saveProduct',
      value: function _saveProduct(productId) {
        var items = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');

        // We check if the current product already exists, and if it does not, we add it at the start
        if (!items.includes(productId)) {
          items.unshift(productId);
        }

        // Then, we save the current product into the local storage, by keeping only the 8 most recent
        try {
          localStorage.setItem('recentlyViewedProducts', JSON.stringify(items.slice(0, 8)));
        } catch (error) {
          // Do nothing, this may happen in Safari in incognito mode
        }
      }

      /**
       * In order to get the products to display, we hit the search template with the given IDS
       */

    }, {
      key: '_fetchProducts',
      value: function _fetchProducts() {
        var _this63 = this;

        var queryString = this._getSearchQueryString();

        if (queryString === '') {
          return;
        }

        // If we have a non empty query string we do a search query
        fetch(window.routes.searchUrl + '?view=recently-viewed-products&type=product&q=' + queryString, {
          credentials: 'same-origin',
          method: 'GET'
        }).then(function (response) {
          response.text().then(function (content) {

            
            var tempElement = document.createElement('div');
            tempElement.innerHTML = content;

            // Set the content
            
            if(!tempElement.querySelector('.Section').classList.contains("hide")) {
            _this63.element.innerHTML = tempElement.querySelector('.Section').innerHTML;

            // Show the section
            _this63.element.parentNode.style.display = 'block';

            // And finally let's create the carousel !
            _this63.carousel = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](_this63.element.querySelector('[data-flickity-config]'));
            }
          });
        });
      }
    }, {
      key: '_getSearchQueryString',
      value: function _getSearchQueryString() {
        var items = JSON.parse(localStorage.getItem('recentlyViewedProducts') || '[]');

        // If we are on a product template, we make sure to remove the main product from the related product
        if (items.includes(this.options['productId'])) {
          items.splice(items.indexOf(this.options['productId']), 1);
        }

        return items.map(function (item) {
          return 'id:' + item;
        }).join(' OR ');
      }
    }]);

    return RecentlyViewedProductsSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = RecentlyViewedProductsSection;

  /***/
},
/* 49 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);

  var SearchSection = function () {
    function SearchSection(container) {
      _classCallCheck(this, SearchSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);

      this._setupAnimation();
    }

    _createClass(SearchSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.intersectionObserver.disconnect();
        this.timeline.kill();
      }
    }, {
      key: '_setupAnimation',
      value: function _setupAnimation() {
        var _this64 = this;

        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
        }

        this.timeline = new TimelineLite({ delay: 0.5 });

        if (window.theme.showElementStaggering) {
          this.intersectionObserver = new IntersectionObserver(this._reveal.bind(this));

          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.ProductList .ProductItem, .ArticleList .ArticleItem')).forEach(function (item) {
            _this64.intersectionObserver.observe(item);
          });
        }
      }
    }, {
      key: '_reveal',
      value: function _reveal(results) {
        var _this65 = this;

        var toReveal = [];

        results.forEach(function (result) {
          if (result.isIntersecting || result.intersectionRatio > 0) {
            // isIntersecting does not exist on Samsung Android browser
            toReveal.push(result.target);
            _this65.intersectionObserver.unobserve(result.target);
          }
        });

        if (toReveal.length === 0) {
          return;
        }

        this.timeline.staggerFromTo(toReveal, 0.6, { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0 }, 0.2);
      }
    }]);

    return SearchSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = SearchSection;

  /***/
},
/* 50 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);

  /**
   * This code is extracted from Slate
   */

  var SectionContainer = function () {
    function SectionContainer() {
      _classCallCheck(this, SectionContainer);

      this.constructors = [];
      this.instances = [];

      this._attachListeners();
    }

    _createClass(SectionContainer, [{
      key: '_attachListeners',
      value: function _attachListeners() {
        document.addEventListener('shopify:section:load', this._onSectionLoad.bind(this));
        document.addEventListener('shopify:section:unload', this._onSectionUnload.bind(this));
        document.addEventListener('shopify:section:select', this._onSelect.bind(this));
        document.addEventListener('shopify:section:deselect', this._onDeselect.bind(this));
        document.addEventListener('shopify:section:reorder', this._onReorder.bind(this));
        document.addEventListener('shopify:block:select', this._onBlockSelect.bind(this));
        document.addEventListener('shopify:block:deselect', this._onBlockDeselect.bind(this));
      }
    }, {
      key: 'register',
      value: function register(type, constructor) {
        var _this66 = this;

        this.constructors[type] = constructor;

        __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(document.querySelectorAll('[data-section-type=' + type + ']')).forEach(function (container) {
          _this66._createInstance(container, constructor);
        });
      }

      /**
       * Return an object from an array of objects that matches the provided key and value
       */

    }, {
      key: '_findInstance',
      value: function _findInstance(array, key, value) {
        for (var i = 0; i < array.length; i++) {
          if (array[i][key] === value) {
            return array[i];
          }
        }
      }

      /**
       * Remove an object from an array of objects by matching the provided key and value
       */

    }, {
      key: '_removeInstance',
      value: function _removeInstance(array, key, value) {
        var i = array.length;

        while (i--) {
          if (array[i][key] === value) {
            array.splice(i, 1);
            break;
          }
        }

        return array;
      }
    }, {
      key: '_onSectionLoad',
      value: function _onSectionLoad(event) {
        var container = event.target.querySelector('[data-section-id]');

        if (container) {
          this._createInstance(container);
        }
      }
    }, {
      key: '_onSectionUnload',
      value: function _onSectionUnload(event) {
        var instance = this._findInstance(this.instances, 'id', event.detail.sectionId);

        if (!instance) {
          return;
        }

        if (typeof instance.onUnload === 'function') {
          instance.onUnload(event);
        }

        this.instances = this._removeInstance(this.instances, 'id', event.detail.sectionId);
      }
    }, {
      key: '_onSelect',
      value: function _onSelect(event) {
        var instance = this._findInstance(this.instances, 'id', event.detail.sectionId);

        if (instance && typeof instance.onSelect === 'function') {
          instance.onSelect(event);
        }
      }
    }, {
      key: '_onDeselect',
      value: function _onDeselect(event) {
        var instance = this._findInstance(this.instances, 'id', event.detail.sectionId);

        if (instance && typeof instance.onDeselect === 'function') {
          instance.onDeselect(event);
        }
      }
    }, {
      key: '_onReorder',
      value: function _onReorder(event) {
        var instance = this._findInstance(this.instances, 'id', event.detail.sectionId);

        if (instance && typeof instance.onReorder === 'function') {
          instance.onReorder(event);
        }
      }
    }, {
      key: '_onBlockSelect',
      value: function _onBlockSelect(event) {
        var instance = this._findInstance(this.instances, 'id', event.detail.sectionId);

        if (instance && typeof instance.onBlockSelect === 'function') {
          instance.onBlockSelect(event);
        }
      }
    }, {
      key: '_onBlockDeselect',
      value: function _onBlockDeselect(event) {
        var instance = this._findInstance(this.instances, 'id', event.detail.sectionId);

        if (instance && typeof instance.onBlockDeselect === 'function') {
          instance.onBlockDeselect(event);
        }
      }
    }, {
      key: '_createInstance',
      value: function _createInstance(container, constructor) {
        var id = container.getAttribute('data-section-id'),
            type = container.getAttribute('data-section-type');

        constructor = constructor || this.constructors[type];

        if (typeof constructor === 'undefined') {
          return;
        }

        var instance = Object.assign(new constructor(container), {
          id: id,
          type: type,
          container: container
        });

        this.instances.push(instance);
      }
    }]);

    return SectionContainer;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = SectionContainer;

  /***/
},
/* 51 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__ = __webpack_require__(4);

  var ShopNowSection = function () {
    function ShopNowSection(container) {
      _classCallCheck(this, ShopNowSection);

      this.element = container;
      this.carousel = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](this.element.querySelector('[data-flickity-config]'));

      // Setup product item color swatch
      new __WEBPACK_IMPORTED_MODULE_1__components_ProductItemColorSwatch__["default"](this.element);
    }

    _createClass(ShopNowSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.carousel.destroy();
      }
    }]);

    return ShopNowSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ShopNowSection;

  /***/
},
/* 52 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__components_Popover__ = __webpack_require__(3);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__helper_Responsive__ = __webpack_require__(1);

  var ShopTheLookSection = function () {
    function ShopTheLookSection(container) {
      _classCallCheck(this, ShopTheLookSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.usePocketMode = __WEBPACK_IMPORTED_MODULE_3__helper_Responsive__["default"].matchesBreakpoint('pocket');
      this.pocketActivatorButton = this.element.querySelector('[data-action="open-look"]');

      this._createOuterCarousel();
      this._createPocketPopovers();

      this._attachListeners();
    }

    _createClass(ShopTheLookSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.outerCarousel.destroy();
        this.innerCarousels.forEach(function (item) {
          item.forEach(function (innerItem) {
            return innerItem.destroy();
          });
        });

        this.popovers.forEach(function (item) {
          return item.destroy();
        });

        this.delegateElement.off();
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        this.outerCarousel.selectCell(event.target.getAttribute('data-slide-index'), true, !event.detail.load);
      }

      /**
       * Attach all the listeners
       */

    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '.ShopTheLook__Dot', this._onDotClicked.bind(this));
      }

      /**
       * There is one mobile and tablet popover per look, so we pre-create them
       */

    }, {
      key: '_createPocketPopovers',
      value: function _createPocketPopovers() {
        var _this67 = this;

        this.popovers = [];

        __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.Popover')).forEach(function (popover) {
          _this67.popovers.push(new __WEBPACK_IMPORTED_MODULE_1__components_Popover__["default"](popover, {
            activator: _this67.pocketActivatorButton,
            showOverlay: false,
            onOpen: _this67._openPocketZoom.bind(_this67),
            onClose: _this67._closePocketZoom.bind(_this67)
          }));
        });
      }

      /**
       * The outer carousel is the carousel that holds the main one (all the looks). Internally, it also creates
       * a sub-carousel for each inner carousel
       */

    }, {
      key: '_createOuterCarousel',
      value: function _createOuterCarousel() {
        var _this68 = this;

        this.outerCarousel = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](this.element.querySelector('.ShopTheLook'), {
          onSelect: this._onLookChanged.bind(this)
        });

        this.innerCarousels = new Array(this.outerCarousel.flickityInstance.cells.length);

        for (var i = 0; i !== this.innerCarousels.length; ++i) {
          this.innerCarousels[i] = [];
        }

        // We need to create ALL the carousels (both in desktop and mobile). Fortunately Flickity is quite fast, but
        // we have no other choices if we want to have proper animations everywhere.
        __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.ShopTheLook__ProductList')).forEach(function (item) {
          var lookIndex = parseInt(item.getAttribute('data-look-index'));
          _this68.innerCarousels[lookIndex].push(new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](item, { onSelect: _this68._onProductChanged.bind(_this68) }));

          // By default, Flickity will append the carousel, hence making the "ViewButton" before the carousel. We need to manipulate it to move it after
          item.insertBefore(item.querySelector('.flickity-viewport'), item.querySelector('.ShopTheLook__ViewButton'));
        });

        this.outerCarousel.resize(); // Needed in case the products are taller than the image
      }

      /**
       * This function is called whenever the main look has changed, so that we can modify the popover activator
       */

    }, {
      key: '_onLookChanged',
      value: function _onLookChanged(selectedIndex, selectedCell) {
        // Then, we update the mobile button so that it opens the correct block
        this.pocketActivatorButton.setAttribute('aria-controls', selectedCell.getAttribute('id') + '-popover');
      }

      /**
       * This function is called whenever a product is changed in the list for a given look. This allows to focus the main dot
       */

    }, {
      key: '_onProductChanged',
      value: function _onProductChanged(selectedIndex, selectedCell) {
        var lookItem = this.outerCarousel.getSelectedCell(),
            activeDot = null;

        __WEBPACK_IMPORTED_MODULE_2__helper_Dom__["default"].nodeListToArray(lookItem.querySelectorAll('.ShopTheLook__Dot')).forEach(function (dot, index) {
          dot.classList.remove('is-active'); // IE11 and lower does not support "toggle" with second parameter :(

          if (index === selectedIndex) {
            dot.classList.add('is-active');
            activeDot = dot;
          }
        });

        // Update the link to the product (if using the desktop view)
        lookItem.querySelector('.ShopTheLook__ViewButton').setAttribute('href', selectedCell.getAttribute('data-product-url'));

        // We trigger an event so that when the dot change we can recalculate the position
        lookItem.dispatchEvent(new CustomEvent('product:changed', { detail: { dot: activeDot } }));
      }

      /**
       * This function is called whenever you explicitly click on a dot.
       *
       * On mobile and tablet, this must open the appropriate popver
       */

    }, {
      key: '_onDotClicked',
      value: function _onDotClicked(event, target) {
        var shouldAnimateCarousel = false,
            hasOnePopoverOpen = false,
            lookIndex = this.outerCarousel.getSelectedIndex();

        this.popovers.forEach(function (item) {
          if (item.isOpen) {
            hasOnePopoverOpen = true;
            shouldAnimateCarousel = true;
          }
        });

        // Each inner carousel has a mobile AND desktop version, so we change both
        this.innerCarousels[lookIndex].forEach(function (innerCarousel) {
          innerCarousel.selectCell(parseInt(target.getAttribute('data-product-index')) - 1, false, shouldAnimateCarousel);
        });

        if (this.usePocketMode && !hasOnePopoverOpen) {
          this.popovers[lookIndex].open();
        }
      }

      /**
       * This is called when, on mobile, the popover is open. We must open the image in full resolution
       */

    }, {
      key: '_openPocketZoom',
      value: function _openPocketZoom(popover) {
        var _this69 = this;

        this._calculateImageTransform(popover);

        fastdom.mutate(function () {
          // We need to animate the header to avoid a slightly ugly effect if image overlap the header
          document.querySelector('.shopify-section--header').style.cssText = 'transform: translateY(-100%); transition: transform 0.3s ease-in-out;';

          _this69.outerCarousel.flickityInstance.unbindDrag(); // Prevent changing the active slide
          _this69.outerCarousel.flickityInstance.element.classList.add('is-zoomed');
          _this69.outerCarousel.getSelectedCell().classList.add('is-expanded');
        });
      }

      /**
       * When the mobile zoom is open, and whenever the active dot changes, we need to potentially re-calculate the transform
       */

    }, {
      key: '_calculateImageTransform',
      value: function _calculateImageTransform(openPopover) {
        var _this70 = this;

        var selectedCell = this.outerCarousel.getSelectedCell();

        fastdom.measure(function () {
          // We first need to compute the initial transform and scale factor
          var scale = window.innerWidth / (selectedCell.offsetWidth - parseInt(window.getComputedStyle(selectedCell).paddingLeft) * 2),
              heightAfterScale = Math.round(selectedCell.offsetHeight * scale),
              // Height of the selected cell once the scale transform is applied
          hiddenImageHeight = Math.round(Math.max(heightAfterScale - (window.innerHeight - openPopover.element.offsetHeight), 0)),
              // Part of image that is below popover
          visibleImageHeight = heightAfterScale - hiddenImageHeight,
              // Part of the image that is visible in the viewport
          minTranslateY = Math.round(-(selectedCell.getBoundingClientRect().top - (heightAfterScale - selectedCell.offsetHeight) / 2)),
              // The minimum translate Y transform allowed so that image is visible
          maxTranslateY = Math.round(minTranslateY - hiddenImageHeight); // The maximum translate Y transform allowed so that image is visible

          _this70._calculateTransformForDotListener = function (event) {
            var dotTopPosition = Math.round((event.detail.dot.offsetTop + event.detail.dot.offsetHeight / 2) * scale),
                offsetToMove = Math.round(dotTopPosition - visibleImageHeight / 2),
                translateY = Math.min(Math.max(minTranslateY - offsetToMove, maxTranslateY), minTranslateY);

            fastdom.mutate(function () {
              _this70.outerCarousel.flickityInstance.viewport.style.transform = 'translate3d(0, ' + Math.round(translateY) + 'px, 0) scale(' + scale + ')';
            });
          };

          // We manually generate an event the first time to trigger the positioning

          selectedCell.addEventListener('product:changed', _this70._calculateTransformForDotListener);
          selectedCell.dispatchEvent(new CustomEvent('product:changed', {
            detail: { dot: selectedCell.querySelector('.ShopTheLook__Dot.is-active') }
          }));
        });
      }

      /**
       * Close the mobile zoom (which close the popover and remove any transform
       */

    }, {
      key: '_closePocketZoom',
      value: function _closePocketZoom() {
        var _this71 = this;

        var selectedCell = this.outerCarousel.getSelectedCell();

        selectedCell.removeEventListener('product:changed', this._calculateTransformForDotListener);

        fastdom.mutate(function () {
          document.querySelector('.shopify-section--header').style.cssText = 'transform: translateY(0); transition: transform 0.3s ease-in-out 0.3s;';

          _this71.outerCarousel.flickityInstance.bindDrag();
          _this71.outerCarousel.flickityInstance.element.classList.remove('is-zoomed');
          _this71.outerCarousel.flickityInstance.viewport.style.transform = null;

          selectedCell.classList.remove('is-expanded');
        });
      }
    }]);

    return ShopTheLookSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = ShopTheLookSection;

  /***/
},
/* 53 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Drawer__ = __webpack_require__(6);

  var SidebarMenuSection = function () {
    function SidebarMenuSection(container) {
      _classCallCheck(this, SidebarMenuSection);

      this.element = container;
      this.sidebarDrawer = new __WEBPACK_IMPORTED_MODULE_0__components_Drawer__["default"](container);
    }

    _createClass(SidebarMenuSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.sidebarDrawer.destroy();
      }
    }, {
      key: 'onSelect',
      value: function onSelect() {
        this.sidebarDrawer.open();
      }
    }, {
      key: 'onDeselect',
      value: function onDeselect() {
        this.sidebarDrawer.close();
      }
    }]);

    return SidebarMenuSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = SidebarMenuSection;

  /***/
},
/* 54 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Dom__ = __webpack_require__(0);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__helper_Responsive__ = __webpack_require__(1);

  var SlideshowSection = function () {
    function SlideshowSection(container) {
      _classCallCheck(this, SlideshowSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.slideshow = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](this.element.querySelector('[data-flickity-config]'), { onSelect: this._onSlideChanged.bind(this) });
      this.selectedSlide = null;
      this.shouldAnimate = true;
      this.timeline = new TimelineLite({ delay: window.theme.showPageTransition ? 0.5 : 0 });

      if (this.slideshow.flickityInstance.cells.length > 0) {
        this._transitionToSlide(this.slideshow.flickityInstance.selectedCell.element, true);
      }

      this._attachListeners();
    }

    _createClass(SlideshowSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.slideshow.destroy();
        this.timeline.kill();
        this.delegateElement.off();

        document.removeEventListener('breakpoint:changed', this._onBreakpointChangedListener);
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        if (this.slideshow.flickityInstance.options.autoPlay) {
          this.slideshow.flickityInstance.stopPlayer();
        }

        this.shouldAnimate = !event.detail.load;
        this.slideshow.selectCell(event.target.getAttribute('data-slide-index'), false, !event.detail.load);
      }
    }, {
      key: 'onBlockDeselect',
      value: function onBlockDeselect() {
        this.shouldAnimate = true;

        if (this.slideshow.flickityInstance.options.autoPlay) {
          this.slideshow.flickityInstance.playPlayer();
        }
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this._onBreakpointChangedListener = this._onBreakpointChanged.bind(this);

        this.delegateElement.on('mouseenter', '.Button', this._pauseSlideshow.bind(this), true);
        this.delegateElement.on('mouseleave', '.Button', this._resumeSlideshow.bind(this), true);

        document.addEventListener('breakpoint:changed', this._onBreakpointChangedListener);
      }
    }, {
      key: '_pauseSlideshow',
      value: function _pauseSlideshow() {
        if (this.slideshow.flickityInstance.options.autoPlay) {
          this.slideshow.flickityInstance.pausePlayer();
        }
      }
    }, {
      key: '_resumeSlideshow',
      value: function _resumeSlideshow() {
        if (this.slideshow.flickityInstance.options.autoPlay) {
          this.slideshow.flickityInstance.unpausePlayer();
        }
      }
    }, {
      key: '_onSlideChanged',
      value: function _onSlideChanged(index, element) {
        this._transitionToSlide(element);
      }
    }, {
      key: '_transitionToSlide',
      value: function _transitionToSlide(slide) {
        var _this72 = this;

        this.timeline.clear();

        // First, we check if there is a previous slide selected, if that's the case
        if (this.selectedSlide) {
          this._slideLeave(this.selectedSlide);
          this.timeline.addLabel('enter', this.shouldAnimate ? '-=0.4' : 0);
        }

        // We get the next slide (if any) to preload it
        this._lazyLoadNextImage();

        this.timeline.fromTo(slide, this.selectedSlide && this.shouldAnimate ? 0.3 : 0, { autoAlpha: 0 }, { autoAlpha: 1, ease: Cubic.easeInOut }, 'enter');

        // The image may take 1s or more to load depending on the network, so we make sure to pause the player, and restart it once it has transitioned
        if (this.slideshow.flickityInstance.options.autoPlay && this.slideshow.flickityInstance.player.state === 'playing') {
          this.slideshow.flickityInstance.pausePlayer();
        }

        __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].nodeListToArray(slide.querySelectorAll('.Slideshow__Image')).forEach(function (image) {
          if (image.classList.contains('Image--lazyLoading') || image.classList.contains('Image--lazyLoad')) {
            image.addEventListener('lazyloaded', _this72._slideEnter.bind(_this72, slide));
          } else {
            _this72._slideEnter(slide);
          }
        });

        this.selectedSlide = slide;
      }
    }, {
      key: '_slideLeave',
      value: function _slideLeave(slide) {
        var content = slide.querySelector('.SectionHeader'),
            buttonWrapper = slide.querySelector('.SectionHeader__ButtonWrapper');

        this.timeline.fromTo(slide, this.shouldAnimate ? 0.3 : 0, { autoAlpha: 1 }, { autoAlpha: 0, ease: Cubic.easeInOut, delay: this.shouldAnimate ? 0.35 : 0 });

        if (content) {
          this.timeline.fromTo(content, this.shouldAnimate ? 0.4 : 0, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 20, ease: Cubic.easeIn }, 0);
        }

        if (buttonWrapper) {
          this.timeline.fromTo(buttonWrapper, this.shouldAnimate ? 0.4 : 0, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 10, ease: Cubic.easeIn }, 0);
        }
      }
    }, {
      key: '_slideEnter',
      value: function _slideEnter(slide) {
        var images = slide.querySelectorAll('.Slideshow__Image'),
            content = slide.querySelector('.SectionHeader'),
            buttonWrapper = slide.querySelector('.SectionHeader__ButtonWrapper');

        if (this.slideshow.flickityInstance.options.autoPlay && this.slideshow.flickityInstance.player.state === 'paused') {
          this.slideshow.flickityInstance.unpausePlayer();
        }

        if (window.CSS && window.CSS.supports('(object-fit: cover) or (-o-object-fit: cover)')) {
          if (window.theme.showImageZooming) {
            this.timeline.fromTo(images, this.shouldAnimate ? 1.2 : 0, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, ease: Quad.easeOut }, 'enter');
          } else {
            this.timeline.fromTo(images, this.shouldAnimate ? 1.2 : 0, { opacity: 0 }, { opacity: 1, ease: Quad.easeOut }, 'enter');
          }
        }

        if (content) {
          this.timeline.fromTo(content, this.shouldAnimate ? 0.8 : 0, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, delay: this.shouldAnimate ? 0.8 : 0, ease: Cubic.easeOut }, 'enter');
        }

        if (buttonWrapper) {
          this.timeline.fromTo(buttonWrapper, this.shouldAnimate ? 0.8 : 0, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, delay: this.shouldAnimate ? 0.8 : 0, ease: Cubic.easeOut }, 'enter');
        }
      }
    }, {
      key: '_lazyLoadNextImage',
      value: function _lazyLoadNextImage() {
        var currentIndex = this.slideshow.flickityInstance.selectedIndex,
            breakpoint = __WEBPACK_IMPORTED_MODULE_2__helper_Responsive__["default"].getCurrentBreakpoint();

        if (this.slideshow.flickityInstance.cells.length - 1 > currentIndex) {
          var nextCellElement = this.slideshow.flickityInstance.cells[currentIndex + 1].element,
              imageContainers = __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].nodeListToArray(nextCellElement.querySelectorAll('.Slideshow__ImageContainer')),
              imageToReveal = null;

          if (breakpoint === 'phone') {
            imageToReveal = imageContainers[0];
          } else {
            imageToReveal = imageContainers[1];
          }

          if (window.lazySizes && imageToReveal && imageToReveal.classList.contains('Image--lazyLoad')) {
            lazySizes.loader.unveil(imageToReveal.firstElementChild);
          }
        }
      }
    }, {
      key: '_onBreakpointChanged',
      value: function _onBreakpointChanged(event) {
        if (event.detail.previousBreakpoint === 'phone' && event.detail.currentBreakpoint !== 'phone' || event.detail.previousBreakpoint !== 'phone' && event.detail.currentBreakpoint === 'phone') {
          this.selectedSlide = null;
          this._transitionToSlide(this.slideshow.flickityInstance.selectedElement);
        }
      }
    }]);

    return SlideshowSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = SlideshowSection;

  /***/
},
/* 55 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components_Carousel__ = __webpack_require__(2);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper_Dom__ = __webpack_require__(0);

  var TestimonialsSection = function () {
    function TestimonialsSection(container) {
      _classCallCheck(this, TestimonialsSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.navItems = __WEBPACK_IMPORTED_MODULE_1__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.TestimonialNav__Item'));

      this.carousel = new __WEBPACK_IMPORTED_MODULE_0__components_Carousel__["default"](this.element.querySelector('.TestimonialList'), {
        onSelect: this._testimonialChanged.bind(this)
      });

      this._attachListeners();
    }

    _createClass(TestimonialsSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.carousel.destroy();
        this.delegateElement.off('click');
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        this.carousel.selectCell(event.target.getAttribute('data-slide-index'), true);
      }
    }, {
      key: 'onBlockDeselect',
      value: function onBlockDeselect() {
        this.carousel.unpausePlayer();
      }
    }, {
      key: '_testimonialClicked',
      value: function _testimonialClicked(event, target) {
        this.carousel.pausePlayer();
        this.carousel.selectCell(parseInt(target.getAttribute('data-index')));
        this.carousel.unpausePlayer();
      }
    }, {
      key: '_testimonialChanged',
      value: function _testimonialChanged(newIndex) {
        this.navItems.forEach(function (item, index) {
          item.classList.remove('is-selected'); // IE11 and lower does not support classList.toggle

          if (newIndex === index) {
            item.classList.add('is-selected');
          }
        });
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '.TestimonialNav__Item', this._testimonialClicked.bind(this));
      }
    }]);

    return TestimonialsSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = TestimonialsSection;

  /***/
},
/* 56 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__helper_Dom__ = __webpack_require__(0);

  var TimelineSection = function () {
    function TimelineSection(container) {
      _classCallCheck(this, TimelineSection);

      this.element = container;
      this.delegateElement = new domDelegate.Delegate(this.element);
      this.items = __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.Timeline__Item'));
      this.navItems = __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].nodeListToArray(this.element.querySelectorAll('.Timeline__NavItem'));

      this._attachListeners();
    }

    _createClass(TimelineSection, [{
      key: 'onUnload',
      value: function onUnload() {
        this.delegateElement.off('click');
      }
    }, {
      key: 'onBlockSelect',
      value: function onBlockSelect(event) {
        this.navItems[parseInt(event.target.getAttribute('data-index'))].click(); // Simulate a click on the given nav item
      }
    }, {
      key: '_attachListeners',
      value: function _attachListeners() {
        this.delegateElement.on('click', '.Timeline__NavItem', this._clickOnNavItem.bind(this));
      }
    }, {
      key: '_clickOnNavItem',
      value: function _clickOnNavItem(event, target) {
        var newItem = this.items[parseInt(target.getAttribute('data-index'))];

        if (newItem.classList.contains('is-selected')) {
          return;
        }

        var isContentLarger = false,
            navWrapper = target.parentNode,
            scrollableOffset = 0;

        fastdom.measure(function () {
          var scrollableWidth = navWrapper.scrollWidth,
              visibleWidth = navWrapper.offsetWidth;

          isContentLarger = visibleWidth < scrollableWidth;

          if (isContentLarger) {
            var beginBound = target.offsetLeft,
                endBound = beginBound + target.offsetWidth,
                closerToLeft = beginBound <= visibleWidth - endBound;

            var itemToUse = null;

            if (closerToLeft) {
              // If closer to left, we try to make the previous item visible (if possible)
              itemToUse = target.previousElementSibling || target;
            } else {
              // If closer to right, we try to make the next item visible (if possible)
              itemToUse = target.nextElementSibling || target;
            }

            var itemBeginBound = itemToUse.offsetLeft - navWrapper.scrollLeft,
                itemEndBound = itemBeginBound + itemToUse.offsetWidth;

            if (itemEndBound > visibleWidth) {
              // Element is not visible from the right, so we must move by a given amount so that endBound is within viewable screen
              scrollableOffset = itemEndBound - visibleWidth;
            } else if (itemBeginBound < 0) {
              // Element is not visible from the left, so we simply use the opposite of the negative offset
              scrollableOffset = itemBeginBound;
            }
          }
        });

        fastdom.mutate(function () {
          if (isContentLarger) {
            navWrapper.scrollBy({ behavior: 'smooth', left: scrollableOffset });
          }

          // First we set the class on the selected item and remove it on siblings
          target.classList.add('is-selected');
          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].getSiblings(target, '.is-selected').forEach(function (item) {
            item.classList.remove('is-selected');
          });

          // Then we slide to the appropriate element
          newItem.classList.add('is-selected');
          __WEBPACK_IMPORTED_MODULE_0__helper_Dom__["default"].getSiblings(newItem, '.is-selected').forEach(function (item) {
            item.classList.remove('is-selected');
          });
        });
      }
    }]);

    return TimelineSection;
  }();
  /* harmony export (immutable) */

  __webpack_exports__["default"] = TimelineSection;

  /***/
},
/* 57 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__AddressesSection__ = __webpack_require__(29);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "AddressesSection", function () {
    return __WEBPACK_IMPORTED_MODULE_0__AddressesSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__ArticleListSection__ = __webpack_require__(30);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ArticleListSection", function () {
    return __WEBPACK_IMPORTED_MODULE_1__ArticleListSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__ArticleSection__ = __webpack_require__(31);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ArticleSection", function () {
    return __WEBPACK_IMPORTED_MODULE_2__ArticleSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_3__CartSection__ = __webpack_require__(33);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "CartSection", function () {
    return __WEBPACK_IMPORTED_MODULE_3__CartSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_4__CollectionListSection__ = __webpack_require__(34);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "CollectionListSection", function () {
    return __WEBPACK_IMPORTED_MODULE_4__CollectionListSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_5__CollectionSection__ = __webpack_require__(35);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "CollectionSection", function () {
    return __WEBPACK_IMPORTED_MODULE_5__CollectionSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_6__FaqSection__ = __webpack_require__(36);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "FaqSection", function () {
    return __WEBPACK_IMPORTED_MODULE_6__FaqSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_7__FeaturedCollectionsSection__ = __webpack_require__(37);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "FeaturedCollectionsSection", function () {
    return __WEBPACK_IMPORTED_MODULE_7__FeaturedCollectionsSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_8__FeaturedProductSection__ = __webpack_require__(38);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "FeaturedProductSection", function () {
    return __WEBPACK_IMPORTED_MODULE_8__FeaturedProductSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_9__BackgroundVideoSection__ = __webpack_require__(32);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "BackgroundVideoSection", function () {
    return __WEBPACK_IMPORTED_MODULE_9__BackgroundVideoSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_10__GiftCardSection__ = __webpack_require__(40);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "GiftCardSection", function () {
    return __WEBPACK_IMPORTED_MODULE_10__GiftCardSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_11__HeaderSection__ = __webpack_require__(41);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "HeaderSection", function () {
    return __WEBPACK_IMPORTED_MODULE_11__HeaderSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_12__FooterSection__ = __webpack_require__(39);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "FooterSection", function () {
    return __WEBPACK_IMPORTED_MODULE_12__FooterSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_13__ImageWithTextBlockSection__ = __webpack_require__(42);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ImageWithTextBlockSection", function () {
    return __WEBPACK_IMPORTED_MODULE_13__ImageWithTextBlockSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_14__LoginSection__ = __webpack_require__(43);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "LoginSection", function () {
    return __WEBPACK_IMPORTED_MODULE_14__LoginSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_15__MapSection__ = __webpack_require__(44);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "MapSection", function () {
    return __WEBPACK_IMPORTED_MODULE_15__MapSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_16__NewsletterPopupSection__ = __webpack_require__(45);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "NewsletterPopupSection", function () {
    return __WEBPACK_IMPORTED_MODULE_16__NewsletterPopupSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_17__ProductRecommendationsSection__ = __webpack_require__(46);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductRecommendationsSection", function () {
    return __WEBPACK_IMPORTED_MODULE_17__ProductRecommendationsSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_18__ProductSection__ = __webpack_require__(47);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ProductSection", function () {
    return __WEBPACK_IMPORTED_MODULE_18__ProductSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_19__RecentlyViewedProductsSection__ = __webpack_require__(48);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "RecentlyViewedProductsSection", function () {
    return __WEBPACK_IMPORTED_MODULE_19__RecentlyViewedProductsSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_20__SectionContainer__ = __webpack_require__(50);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "SectionContainer", function () {
    return __WEBPACK_IMPORTED_MODULE_20__SectionContainer__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_21__SearchSection__ = __webpack_require__(49);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "SearchSection", function () {
    return __WEBPACK_IMPORTED_MODULE_21__SearchSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_22__ShopNowSection__ = __webpack_require__(51);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ShopNowSection", function () {
    return __WEBPACK_IMPORTED_MODULE_22__ShopNowSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_23__ShopTheLookSection__ = __webpack_require__(52);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "ShopTheLookSection", function () {
    return __WEBPACK_IMPORTED_MODULE_23__ShopTheLookSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_24__SidebarMenuSection__ = __webpack_require__(53);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "SidebarMenuSection", function () {
    return __WEBPACK_IMPORTED_MODULE_24__SidebarMenuSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_25__SlideshowSection__ = __webpack_require__(54);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "SlideshowSection", function () {
    return __WEBPACK_IMPORTED_MODULE_25__SlideshowSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_26__TestimonialsSection__ = __webpack_require__(55);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "TestimonialsSection", function () {
    return __WEBPACK_IMPORTED_MODULE_26__TestimonialsSection__["default"];
  });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_27__TimelineSection__ = __webpack_require__(56);
  /* harmony reexport (binding) */__webpack_require__.d(__webpack_exports__, "TimelineSection", function () {
    return __WEBPACK_IMPORTED_MODULE_27__TimelineSection__["default"];
  });

  /***/
},
/* 58 */
/***/function (module, exports, __webpack_require__) {

  __webpack_require__(5);
  __webpack_require__(7);
  __webpack_require__(8);
  __webpack_require__(0);
  __webpack_require__(22);
  __webpack_require__(9);
  __webpack_require__(1);
  __webpack_require__(10);
  __webpack_require__(2);
  __webpack_require__(23);
  __webpack_require__(12);
  __webpack_require__(6);
  __webpack_require__(24);
  __webpack_require__(25);
  __webpack_require__(13);
  __webpack_require__(26);
  __webpack_require__(3);
  __webpack_require__(14);
  __webpack_require__(4);
  __webpack_require__(15);
  __webpack_require__(16);
  __webpack_require__(11);
  __webpack_require__(18);
  __webpack_require__(19);
  __webpack_require__(28);
  __webpack_require__(20);
  __webpack_require__(27);
  __webpack_require__(17);
  __webpack_require__(21);
  __webpack_require__(29);
  __webpack_require__(30);
  __webpack_require__(31);
  __webpack_require__(32);
  __webpack_require__(33);
  __webpack_require__(34);
  __webpack_require__(35);
  __webpack_require__(36);
  __webpack_require__(37);
  __webpack_require__(38);
  __webpack_require__(39);
  __webpack_require__(40);
  __webpack_require__(41);
  __webpack_require__(42);
  __webpack_require__(43);
  __webpack_require__(44);
  __webpack_require__(45);
  __webpack_require__(46);
  __webpack_require__(47);
  __webpack_require__(48);
  __webpack_require__(49);
  __webpack_require__(50);
  __webpack_require__(51);
  __webpack_require__(52);
  __webpack_require__(53);
  __webpack_require__(54);
  __webpack_require__(55);
  __webpack_require__(56);
  __webpack_require__(57);
  module.exports = __webpack_require__(59);

  /***/
},
/* 59 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__components__ = __webpack_require__(21);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__helper__ = __webpack_require__(10);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_2__sections__ = __webpack_require__(57);

  (function () {
    // First, we register all plugins that are used for all pages
    new __WEBPACK_IMPORTED_MODULE_0__components__["Collapsible"]();
    new __WEBPACK_IMPORTED_MODULE_0__components__["Modal"]();
    new __WEBPACK_IMPORTED_MODULE_1__helper__["ResponsiveHelper"]();

    if (window.theme.pageType !== 'password' && window.theme.pageType !== 'gift_card') {
      new __WEBPACK_IMPORTED_MODULE_0__components__["LoadingBar"]();
    }

    var sections = new __WEBPACK_IMPORTED_MODULE_2__sections__["SectionContainer"]();

    sections.register('header', __WEBPACK_IMPORTED_MODULE_2__sections__["HeaderSection"]);
    sections.register('footer', __WEBPACK_IMPORTED_MODULE_2__sections__["FooterSection"]);
    sections.register('sidebar-menu', __WEBPACK_IMPORTED_MODULE_2__sections__["SidebarMenuSection"]);
    sections.register('cart', __WEBPACK_IMPORTED_MODULE_2__sections__["CartSection"]);
    sections.register('newsletter-popup', __WEBPACK_IMPORTED_MODULE_2__sections__["NewsletterPopupSection"]);

    // Sections used on index
    sections.register('slideshow', __WEBPACK_IMPORTED_MODULE_2__sections__["SlideshowSection"]);
    sections.register('collection-list', __WEBPACK_IMPORTED_MODULE_2__sections__["CollectionListSection"]);
    sections.register('article-list', __WEBPACK_IMPORTED_MODULE_2__sections__["ArticleListSection"]);
    sections.register('featured-product', __WEBPACK_IMPORTED_MODULE_2__sections__["FeaturedProductSection"]);
    sections.register('image-with-text-block', __WEBPACK_IMPORTED_MODULE_2__sections__["ImageWithTextBlockSection"]);
    sections.register('timeline', __WEBPACK_IMPORTED_MODULE_2__sections__["TimelineSection"]);
    sections.register('map', __WEBPACK_IMPORTED_MODULE_2__sections__["MapSection"]);
    sections.register('featured-collections', __WEBPACK_IMPORTED_MODULE_2__sections__["FeaturedCollectionsSection"]);
    sections.register('shop-the-look', __WEBPACK_IMPORTED_MODULE_2__sections__["ShopTheLookSection"]);
    sections.register('testimonials', __WEBPACK_IMPORTED_MODULE_2__sections__["TestimonialsSection"]);
    sections.register('background-video', __WEBPACK_IMPORTED_MODULE_2__sections__["BackgroundVideoSection"]);

    // Sections used on product page
    sections.register('product', __WEBPACK_IMPORTED_MODULE_2__sections__["ProductSection"]);
    sections.register('product-recommendations', __WEBPACK_IMPORTED_MODULE_2__sections__["ProductRecommendationsSection"]);

    // Sections used on collection page
    sections.register('collection', __WEBPACK_IMPORTED_MODULE_2__sections__["CollectionSection"]);

    // Sections used on blog page
    sections.register('article-list', __WEBPACK_IMPORTED_MODULE_2__sections__["ArticleListSection"]);

    // Sections used on article page
    sections.register('article', __WEBPACK_IMPORTED_MODULE_2__sections__["ArticleSection"]);

    // Sections used on content pages
    sections.register('faq', __WEBPACK_IMPORTED_MODULE_2__sections__["FaqSection"]);

    // Sections used on login page
    sections.register('login', __WEBPACK_IMPORTED_MODULE_2__sections__["LoginSection"]);

    // Sections used on addresses page
    sections.register('addresses', __WEBPACK_IMPORTED_MODULE_2__sections__["AddressesSection"]);

    // Sections used on gift card page
    sections.register('gift-card', __WEBPACK_IMPORTED_MODULE_2__sections__["GiftCardSection"]);

    // Sections used on search page
    sections.register('search', __WEBPACK_IMPORTED_MODULE_2__sections__["SearchSection"]);

    // Sections used on different pages
    sections.register('recently-viewed-products', __WEBPACK_IMPORTED_MODULE_2__sections__["RecentlyViewedProductsSection"]);
    sections.register('shop-now', __WEBPACK_IMPORTED_MODULE_2__sections__["ShopNowSection"]);

    /**
     * ----------------------------------------------------------------------------
     * FLICKITY
     *
     * Starting from iOS 11, Safari on iOS is experiencing a bug that prevents
     * event.preventDefault to be called on dynamically added listeners, which is
     * what Flickity is using.
     *
     * The bug is coming from iOS but it impacts indirectly Flickity. A temporary
     * fix has been suggested here: https://github.com/metafizzy/flickity/issues/740
     * and that we are using here as a temporary workaround, that should be removed
     * once the bug is fixed on iOS
     * ----------------------------------------------------------------------------
     */

    Flickity.defaults.dragThreshold = 7;

    (function () {
      var touchingCarousel = false,
          touchStartCoords = void 0;

      document.body.addEventListener('touchstart', function (e) {
        if (e.target.closest('.flickity-slider')) {
          touchingCarousel = true;
        } else {
          touchingCarousel = false;
          return;
        }

        touchStartCoords = {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        };
      });

      document.body.addEventListener('touchmove', function (e) {
        if (!(touchingCarousel && e.cancelable)) {
          return;
        }

        var moveVector = {
          x: e.touches[0].pageX - touchStartCoords.x,
          y: e.touches[0].pageY - touchStartCoords.y
        };

        if (Math.abs(moveVector.x) > Flickity.defaults.dragThreshold) e.preventDefault();
      }, { passive: false });
    })();

    /**
     * ----------------------------------------------------------------------------
     * RTE
     * ----------------------------------------------------------------------------
     */

    (function () {
      // We wrap each RTE table by a specific class to allow wrapping
      __WEBPACK_IMPORTED_MODULE_1__helper__["DomHelper"].nodeListToArray(document.querySelectorAll('.Rte table')).forEach(function (table) {
        table.outerHTML = '<div class="TableWrapper">' + table.outerHTML + '</div>';
      });

      __WEBPACK_IMPORTED_MODULE_1__helper__["DomHelper"].nodeListToArray(document.querySelectorAll('.Rte iframe')).forEach(function (iframe) {
        // We scope the wrapping only for YouTube and Vimeo
        if (iframe.src.indexOf('youtube') !== -1 || iframe.src.indexOf('youtu.be') !== -1 || iframe.src.indexOf('vimeo') !== -1) {
          iframe.outerHTML = '<div class="VideoWrapper">' + iframe.outerHTML + '</div>';

          // Re-set the src attribute on each iframe after page load for Chrome's "incorrect iFrame content on 'back'" bug.
          // https://code.google.com/p/chromium/issues/detail?id=395791. Need to specifically target video and admin bar
          iframe.src = iframe.src;
        }
      });
    })();

    /**
     * ----------------------------------------------------------------------------
     * UTILS
     * ----------------------------------------------------------------------------
     */

    (function () {
      var documentDelegate = new domDelegate.Delegate(document.body),
          announcementBar = document.querySelector('.AnnouncementBar'),
          headerBar = document.querySelector('.shopify-section--header');

      documentDelegate.on('click', '[href^="#"], [data-href]', function (event, target) {
        var selector = target.hasAttribute('href') ? target.getAttribute('href') : target.getAttribute('data-href');

        if (selector === '#' || selector.indexOf("#ctabutton") > -1) {
          return;
        }

        var element = document.querySelector(selector),
            offset = parseInt(target.getAttribute('data-offset') || 0);

        if (announcementBar) {
          offset -= announcementBar.clientHeight;
        }

        offset -= headerBar.clientHeight;
        
        if (target.hasAttribute('data-focus-on-click')) {
          var prevScrollY = window.pageYOffset;
          element.focus({ preventScroll: true });

          // hack to fix scroll jump after focus
          if (window.pageYOffset !== prevScrollY) {
            window.scrollTo(window.pageXOffset, prevScrollY);
          }

          element.focus();
        }
        
        window.scrollTo({ behavior: 'smooth', top: element.offsetTop + offset });

        event.preventDefault();
      });
    })();

    (function () {
      var windowWidth = window.innerWidth,
          headerSection = document.querySelector('.shopify-section--header');

      window.addEventListener('resize', function () {
        var newWidth = -1;

        fastdom.measure(function () {
          newWidth = window.innerWidth;
        });

        fastdom.mutate(function () {
          if (newWidth === windowWidth) {
            return;
          }

          windowWidth = newWidth;

          document.documentElement.style.setProperty('--window-height', window.innerHeight + 'px');

          if (headerSection) {
            document.documentElement.style.setProperty('--header-height', headerSection.clientHeight + 'px');
          }
        });
      });
    })();

    (function () {
      function handleFirstTab(event) {
        if (event.keyCode === 9) {
          document.body.classList.add('is-tabbing');
          window.removeEventListener('keydown', handleFirstTab);
        }
      }

      window.addEventListener('keydown', handleFirstTab);
    })();

    /**
     * ----------------------------------------------------------------------------
     * ANIMATION
     *
     * Important: this has to be at the very end of the file
     * ----------------------------------------------------------------------------
     */

    if (window.theme.showPageTransition) {
      __WEBPACK_IMPORTED_MODULE_0__components__["PageTransition"].getInstance();
    }
  })();

  /***/
}]
/******/);
