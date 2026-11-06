import { useId } from 'react';

// Original vector compositions for this fictional collection; no external assets.
const directions = {
  'archivo-aurora': ['aurora', '#153871', '#38BDF8', '#8B5CF6'],
  'orbita-de-papel': ['orbit', '#293075', '#A5B4FC', '#38BDF8'],
  'el-jardin-de-los-ecos': ['garden', '#173C58', '#67E8F9', '#818CF8'],
  'ciudad-de-tinta': ['city', '#35255F', '#C4B5FD', '#60A5FA'],
  'despues-del-ultimo-tren': ['train', '#173D60', '#7DD3FC', '#A78BFA'],
  'la-ruta-del-viento': ['wind', '#273C80', '#BAE6FD', '#8B5CF6'],
};

function Stars() {
  // Same stars and radii, grouped into two paths to avoid ten repeated nodes per scene.
  const points = [[67, 73, 2], [132, 182, 1], [242, 65, 1], [325, 147, 2], [454, 98, 1], [526, 215, 1], [97, 320, 2], [385, 294, 1], [497, 371, 1], [213, 254, 2]];
  return <g fill="#E0F2FE">
    {[.75, .35].map((opacity, group) => <path key={opacity} opacity={opacity} d={points.filter((_, i) => i % 2 === group).map(([x, y, r]) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`).join('')} />)}
    <path d="m448 192 2-9 2 9 9 2-9 2-2 9-2-9-9-2Z" opacity=".8" />
  </g>;
}

function Scene({ name, light, accent }) {
  if (name === 'aurora') return <>
    <path d="m64 208 62-58 75 36 62-88m-137 52 43-69" fill="none" stroke={light} opacity=".3" /><g fill={light}><circle cx="64" cy="208" r="3" /><circle cx="201" cy="186" r="3" /><circle cx="263" cy="98" r="3" /></g>
    <g fill="none" stroke={light} opacity=".4"><path d="M60 0Q410 180 135 450" strokeWidth="14" /><path d="M240-20Q530 230 325 470" strokeWidth="4" /><path d="M350 0Q620 180 460 440" strokeWidth="40" opacity=".35" /></g>
    <path d="m0 570 125-226 150 131 145-98 180 168v255H0Z" fill="#102646" />
    <path d="m125 344 33 78-42-17-30 28Z" fill="#C7E8F5" opacity=".75" />
    <path d="m0 650 190-160 135 73 143-74 132 109v202H0Z" fill="#0A1830" />
    <g transform="translate(325 440)"><path d="M0 38h94v82H0Z" fill="#0A1427" stroke="#41799E" /><path d="M-12 38a59 59 0 0 1 118 0Z" fill="#183857" stroke={light} /><path d="M46-21v59M17 53h14v20H17m44-20h14v20H61" fill={light} opacity=".8" /><path d="M47-22 67-62" stroke={accent} strokeWidth="3" /></g>
  </>;
  if (name === 'orbit') return <>
    <g transform="rotate(-28 300 345)" fill="none"><ellipse cx="300" cy="345" rx="255" ry="86" stroke={light} opacity=".75" strokeWidth="2" /><ellipse cx="300" cy="345" rx="274" ry="106" stroke={accent} opacity=".3" /></g>
    <circle cx="300" cy="345" r="104" fill="#313F83" stroke="#BFCBFF" strokeWidth="2" /><path d="M222 278q132 6 167 104M205 327q130 2 168 94" fill="none" stroke={light} opacity=".35" />
    <g fill="#DCE8FF" stroke="#8CA6DD"><path d="m135 188 66-19 29 92-67 19Z" /><path d="m432 449 58 25-31 75-58-25Z" /><path d="m91 440 40-34 52 64-40 33Z" /></g>
    <g stroke="#526AAA" strokeWidth="3"><path d="m154 202 38-11m-33 28 38-11m223 310 30 12m-20-29 30 12" /></g>
    <path d="m135 188 22 39 44-58m-44 58 73 34m202 188 8 47 50-22" fill="none" stroke="#657DB3" strokeWidth="2" /><path d="M66 337q70-213 322-218" fill="none" stroke={light} strokeDasharray="4 13" opacity=".4" />
    <path d="M0 650Q220 565 600 655v145H0Z" fill="#0B1631" />
  </>;
  if (name === 'garden') return <>
    <circle cx="326" cy="265" r="100" fill={light} opacity=".08" /><circle cx="326" cy="265" r="75" fill={light} opacity=".1" />
    <g fill="none" stroke="#416A86" strokeWidth="4"><path d="M90 690Q220 404 132 230M460 670Q335 442 490 220M252 700Q320 461 280 385" /></g>
    <g fill={accent} opacity=".8"><path d="M130 276q-97-100-80-144 82 26 80 144M136 338q88-113 129-93-17 71-129 93M466 320q-73-99-110-78 8 69 110 78M454 402q105-107 132-69-32 69-132 69" /></g>
    <g stroke={light} fill="#15334C"><path d="M286 536v105m-77-105q77-117 154 0Z" /><path d="M402 592v50m-47-50q47-71 94 0Z" /><path d="M139 567v67m-56-67q56-86 112 0Z" /></g>
    <g fill={light}><circle cx="214" cy="369" r="3" /><circle cx="373" cy="428" r="4" /><circle cx="297" cy="294" r="2" /><circle cx="88" cy="457" r="3" /></g>
    <path d="M0 669q300-72 600-7v138H0Z" fill="#091A2D" />
    <g fill="none" stroke={light} opacity=".4"><path d="M225 532q61-76 122 0m-246 33q37-49 74 0m191 24q37-49 74 0" /><path d="m304 608 20 2m-42 24 25 3m-59 28 39 4m-87 30 57 6" strokeWidth="4" /></g>
  </>;
  if (name === 'city') return <>
    <circle cx="352" cy="228" r="94" fill={light} opacity=".12" />
    <g fill="#15203D" stroke="#6660A4"><path d="M18 658V352h82v306m18 0V260h70v398m25 0V385h53v273m28 0V194h84v464m24 0V318h61v340m21 0V244h91v414" /><path d="M127 260v-43h51v43m129-66 29-69 29 69m141 50v-63h45v63" /></g>
    <g fill={light} opacity=".75">{[45, 142, 229, 320, 425, 511].map((x, i) => <g key={x}><path d={`M${x} 413h8v12h-8Zm0 37h8v12h-8Zm0 37h8v12h-8Z`} /><path d={`M${x + 18} ${i % 2 ? 340 : 540}h8v12h-8Z`} /></g>)}</g>
    <path d="M-20 591q320-160 650 0" fill="none" stroke={accent} strokeWidth="3" /><path d="M0 607q300-139 600 0M90 548v23m105-55v18m105-26v17m105-9v18m105 14v23" fill="none" stroke={accent} opacity=".5" strokeWidth="2" /><path d="M0 683h600v117H0Z" fill="#0C142A" />
  </>;
  if (name === 'train') return <>
    <circle cx="418" cy="216" r="76" fill={light} opacity=".15" />
    <path d="m0 620 245-184h112L600 620v180H0Z" fill="#0B1B35" />
    <g stroke="#3D6E95" fill="none"><path d="m50 800 220-365M545 800 333 435M140 800l137-365M461 800 132-365" /><path d="M110 690h382M158 622h278M203 555h183M235 499h112" /></g>
    <path d="M228 419q0-97 72-97t72 97v116H228Z" fill="#1D4363" stroke={light} strokeWidth="2" /><path d="M247 403h106v62H247Z" fill="#0C213B" stroke={light} /><path d="M300 403v62" stroke={light} />
    <path d="m251 498-85 153h169Zm98 0-85 153h169Z" fill={light} opacity=".08" /><circle cx="479" cy="276" r="25" fill="#0C213B" stroke={light} opacity=".8" /><path d="M479 260v17l12 6" fill="none" stroke={light} strokeWidth="3" />
    <g fill={light}><circle cx="251" cy="498" r="6" /><circle cx="349" cy="498" r="6" /></g><path d="M250 548h100" stroke={accent} strokeWidth="4" />
    <path d="M70 587V321m0 0h89M516 587V321m0 0h-89" fill="none" stroke="#385C7E" strokeWidth="6" /><path d="M129 321h43m256 0h43" stroke={light} strokeWidth="5" />
  </>;
  return <>
    <circle cx="380" cy="243" r="102" fill={light} opacity=".12" />
    <g fill="none" stroke={light}><path d="M-20 250q135-130 290-15t350-63M-20 285q135-130 290-15t350-63M70 410q200-118 510-10" opacity=".5" /><path d="M-10 370q230-148 440-64" strokeWidth="3" opacity=".2" /></g>
    <g fill="#102248" stroke="#5279B0"><path d="m65 474 139-84 95 33-82 70-86 65Z" /><path d="m335 541 132-62 102 50-107 71Z" /><path d="m224 289 67-40 63 28-62 54Z" /></g>
    <g stroke={light} fill="none" opacity=".6"><path d="m154 417 31-118 35 106M185 299l66 53-79 11" /><path d="m439 502 18-81 22 72m-22-72 44 35-52 7" /></g>
    <path d="m185 299 1 59 65-6m206 69 1 38 43-3M90 216q18-20 36 0m9-28q13-14 26 0M352 369q21-24 42 0" fill="none" stroke={light} opacity=".6" strokeWidth="2" />
    <path d="M0 708q300-91 600-28v120H0Z" fill="#0A1532" />
  </>;
}

export function CoverArtwork({ id }) {
  const unique = useId().replaceAll(':', '');
  const [scene, sky, light, accent] = directions[Object.hasOwn(directions, id) ? id : 'archivo-aurora'];
  return <svg className="cover-artwork" viewBox="0 0 600 800" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${unique}-sky`} x2=".7" y2="1"><stop stopColor={sky} /><stop offset="1" stopColor="#091225" /></linearGradient>
      <radialGradient id={`${unique}-glow`}><stop stopColor={accent} stopOpacity=".35" /><stop offset="1" stopColor={accent} stopOpacity="0" /></radialGradient>
      <linearGradient id={`${unique}-shade`} x2="0" y2="1"><stop offset=".55" stopColor="#070F20" stopOpacity="0" /><stop offset="1" stopColor="#070F20" stopOpacity=".96" /></linearGradient>
    </defs>
    <path fill={`url(#${unique}-sky)`} d="M0 0h600v800H0Z" />
    <circle cx="420" cy="200" r="360" fill={`url(#${unique}-glow)`} />
    <Stars />
    <Scene name={scene} light={light} accent={accent} />
    <path fill={`url(#${unique}-shade)`} d="M0 0h600v800H0Z" />
  </svg>;
}

export function NightArtwork() {
  const unique = useId().replaceAll(':', '');
  return <svg className="night-artwork" viewBox="0 0 1000 680" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id={`${unique}-atmosphere`}><stop stopColor="#2563EB" stopOpacity=".6" /><stop offset="1" stopColor="#0B1020" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${unique}-moon`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#C5E5FF" /><stop offset=".5" stopColor="#619DE3" /><stop offset="1" stopColor="#304F96" /></linearGradient>
      <linearGradient id={`${unique}-portal`} x2="0" y2="1"><stop stopColor="#38BDF8" /><stop offset="1" stopColor="#8B5CF6" stopOpacity=".05" /></linearGradient>
    </defs>
    <ellipse cx="600" cy="310" rx="430" ry="350" fill={`url(#${unique}-atmosphere)`} />
    <g transform="translate(260 20)"><Stars /><g transform="translate(340 20) scale(.7)"><Stars /></g></g>
    <circle cx="656" cy="266" r="170" fill={`url(#${unique}-moon)`} opacity=".9" />
    <g fill="none" stroke="#D5E8FF" opacity=".12"><circle cx="705" cy="218" r="45" /><circle cx="602" cy="279" r="26" /><circle cx="703" cy="331" r="61" /></g>
    <ellipse cx="644" cy="300" rx="260" ry="73" fill="none" stroke="#60A5FA" opacity=".4" transform="rotate(-29 644 300)" />
    <path d="m0 528 194-99 156 62 163-145 157 123 111-88 219 130v169H0Z" fill="#122444" />
    <path d="m513 346 32 74-37-15-28 24-17-2Z" fill="#6286B4" opacity=".5" />
    <path d="m0 606 202-91 161 43 172-83 179 62 139-66 147 40v169H0Z" fill="#0B172D" />
    <path d="M571 544V324q0-102 85-102t85 102v220" fill="#102140" fillOpacity=".8" stroke={`url(#${unique}-portal)`} strokeWidth="4" />
    <path d="M584 539V326q0-89 72-89t72 89v213" fill="none" stroke="#38BDF8" opacity=".25" />
    <path d="m558 544 32-7h133l34 7-101 18Z" fill="#233B60" /><path d="m571 544 85 70 85-70" fill="none" stroke="#60A5FA" opacity=".3" />
    <path d="m656 562-92 118h184Z" fill="#22446E" opacity=".25" />
    <g fill="#050D1B"><path d="m0 647 255-50 177 32 181-53 214 45 173-48v107H0Z" /><circle cx="651" cy="532" r="6" /><path d="m646 540-5 30h21l-6-30Zm1 25-3 25h5l3-23 3 23h5l-4-25Z" /></g>
    <g stroke="#38BDF8" fill="none" opacity=".5"><path d="m824 480 37-100m-24 67 51-41M361 525l-20-65m13 43-32-25" /></g>
  </svg>;
}
