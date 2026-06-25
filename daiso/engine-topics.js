/* ===== ĐẠI SỐ 10 — PARAMETRIC GENERATORS ===== */

APP.genQuestion = function(topicId, seed){
  const ri = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
  const rf = (min,max) => Math.round((Math.random()*(max-min)+min)*10)/10;
  const p = arr => arr[ri(0,arr.length-1)];
  const sh = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=ri(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const tier = () => { const t=Math.random(); return t<0.5?'easy':t<0.85?'medium':'hard'; };

  const genMenhDe = () => {
    const d = tier();
    const qs = [];
    // 1. Phủ định mệnh đề
    qs.push(() => {
      const st = p([{q:'\\forall x \\in \\mathbb{R}, x^2 \\ge 0', a:'\\exists x \\in \\mathbb{R}, x^2 < 0'},
        {q:'\\forall x \\in \\mathbb{R}, x+1 > x', a:'\\exists x \\in \\mathbb{R}, x+1 \\le x'},
        {q:'\\exists n \\in \\mathbb{N}, n^2 = n', a:'\\forall n \\in \\mathbb{N}, n^2 \\neq n'},
        {q:'\\forall x \\in \\mathbb{Z}, x^2 > 0', a:'\\exists x \\in \\mathbb{Z}, x^2 \\le 0'}]);
      const distractors = sh([`${st.a}`,`$\\forall x \\in \\mathbb{R}, x^2 \\le 0$`,`$\\exists x \\in \\mathbb{R}, x^2 > 0$`,`$\\forall x \\in \\mathbb{R}, x^2 < 0$`].filter(s=>s!==st.a));
      const choices = sh([st.a, ...distractors.slice(0,3)]);
      return { stem:`Mệnh đề phủ định của "$P: ${st.q}$" là:`, choices, answer:choices.indexOf(st.a), explain:'Phủ định $\\forall \\to \\exists$, phủ định $\\ge \\to <$ (hoặc ngược lại).' };
    });
    // 2. Tập hợp giao/hợp/hiệu
    qs.push(() => {
      const a1=ri(1,3), a2=ri(4,6), b1=ri(2,4), b2=ri(6,8), c1=ri(5,7);
      const op = p(['∩','∪','\\']);
      const A = `\\{${a1},${a2},${c1}\\}`, B = `\\{${b1},${b2},${c1}\\}`;
      let ans, exp;
      if(op==='∩'){ ans=`\\{${c1}\\}`; exp=`Giao 2 tập: phần tử chung là ${c1}.`; }
      else if(op==='∪'){ const all=[...new Set([a1,a2,b1,b2,c1])].sort(); ans=`\\{${all.join(',')}\\}`; exp=`Hợp 2 tập: tất cả phần tử của A và B.`; }
      else{ const diff=[a1,a2].filter(x=>x!==c1); ans=`\\{${diff.join(',')}\\}`; exp=`Hiệu: phần tử thuộc A không thuộc B.`; }
      const choices = sh([ans, `\\{${a1},${a2}\\}`, `\\{${b1},${b2}\\}`, `\\{${c1}\\}`]);
      return { stem:`Cho $A=${A}$, $B=${B}$. Tìm $A${op}B$:`, choices, answer:choices.indexOf(ans), explain:exp };
    });
    // 3. Số phần tử
    qs.push(() => {
      const a=ri(-4,-1), b=ri(1,5);
      const n = b-a+1;
      const choices = sh([`${n}`,`${n+1}`,`${n-1}`,`${n+2}`]);
      return { stem:`Cho $A = \\{x \\in \\mathbb{Z} \\mid ${a} \\le x \\le ${b}\\}$. Số phần tử của A là:`, choices, answer:choices.indexOf(`${n}`), explain:`$A = \\{${Array.from({length:n},(_,i)=>a+i).join(',')}\\}$ có ${n} phần tử.` };
    });
    // 4. Mệnh đề đúng/sai
    qs.push(() => {
      const q = p([{s:'$\\forall x \\in \\mathbb{R}, |x| \\ge 0$', a:0, d:'Đúng vì $|x| \\ge 0$ với mọi $x$.'},
        {s:'$\\forall x \\in \\mathbb{R}, x^2 > 0$', a:1, d:'Sai vì $x=0$ cho $x^2=0$.'},
        {s:'$\\exists x \\in \\mathbb{Q}, x^2 = 2$', a:1, d:'Vô tỷ, không có $x \\in \\mathbb{Q}$.'},
        {s:'$\\forall n \\in \\mathbb{N}, n+1 \\ge n$', a:0, d:'Hiển nhiên đúng.'}]);
      const choices = ['Đúng','Sai'];
      return { stem:`Mệnh đề "${q.s}" là:`, choices, answer:q.a, explain:q.d };
    });
    // 5. Khoảng-đoạn
    qs.push(() => {
      const a=ri(0,3), b=ri(5,8), c=ri(a+1,4), d=ri(c+1,b-1);
      const op = p(['\\cap','\\cup']);
      let ans, exp;
      if(op==='\\cap'){ ans=`(${c},${d})`; exp=`Giao: $(${a},${c}) \\cap (${d},${b})$ rỗng? Chờ, sửa.`; }
      const A=`(${a},${c})`, B=`(${d},${b})`;
      if(op==='\\cap'){ ans='\\emptyset'; exp=`Không có phần chung.`; }
      else{ const allA=`(${a},${c})`, allB=`(${d},${b})`; ans=`(${a},${b})`; exp=`Hợp 2 khoảng.`; }
      const choices = sh([ans, `(${a},${c})`, `(${d},${b})`, `(${a},${d})`]);
      return { stem:`Cho $A=${A}$, $B=${B}$. $A${op}B =$`, choices, answer:choices.indexOf(ans), explain:exp };
    });
    // Pick one
    return p(qs)();
  };

  const genBatPT = () => {
    const d = tier();
    const qs2 = [];
    qs2.push(() => {
      const a=ri(1,3), b=ri(1,4), c=ri(1,5);
      const x=ri(0,2), y=ri(0, Math.max(0, Math.floor((c-a*x)/b)));
      const correct = [x, y];
      const others = [[x+1,ri(0,4)],[x-1,ri(0,4)],[x, y+ri(1,3)]].filter(([px])=>px>=0);
      const options = [correct, ...others].slice(0,4);
      const choices = sh(options.map(([px,py])=>`(${px},${py})`));
      return { type:'mcq', topic:topicId, stem:`Điểm nào thuộc miền nghiệm của $${a}x + ${b}y \le ${c}$?`, choices, answer:choices.indexOf(`(${correct[0]},${correct[1]})`), explain:`Thay tọa độ vào BPT thấy thỏa mãn.`, diff:d };
    });
    qs2.push(() => {
      const x0=ri(0,3), y0=ri(0,3);
      const pts = [[x0,y0],[x0+1,y0-1],[x0-1,y0+1],[x0+2,y0]].filter(([px,py])=>px>=0&&py>=0);
      const choices = sh(pts.map(([px,py]) => `(${px},${py})`));
      return { type:'mcq', topic:topicId, stem:`Hệ $\begin{cases}x+y\le${x0+y0+1}\\x\ge0\\y\ge0\end{cases}$. Điểm thuộc miền nghiệm:`, choices, answer:0, explain:`Thay từng điểm vào hệ BPT.`, diff:d };
    });
    qs2.push(() => {
      const a=ri(2,4), b=ri(2,4), c=ri(2,6);
      const x0=ri(0,2), y0=ri(0, Math.max(0, Math.floor((c-a*x0)/b)));
      const correct = [x0,y0];
      const others = [[x0+1,y0+1],[x0+2,y0],[x0,y0+2]].filter(([px,py])=>px>=0&&py>=0 && a*px+b*py>c);
      const options = [correct, ...others].slice(0,4);
      const choices = sh(options.map(([px,py])=>`(${px},${py})`));
      return { type:'mcq', topic:topicId, stem:`Điểm thuộc miền nghiệm $${a}x+${b}y\le${c}$:`, choices, answer:choices.indexOf(`(${correct[0]},${correct[1]})`), explain:`Thay tọa độ vào BPT, tìm điểm thỏa mãn.`, diff:d };
    });
    qs2.push(() => {
      const a=ri(1,3), b=ri(1,3);
      const ans = a+b;
      return { type:'mcq', topic:topicId, stem:`Bất phương trình $x+y\le${ans}$. Cặp số $(x,y)$ nào thỏa mãn?`, choices:sh([`(${a},${b})`,`(${a+1},${b})`,`(${a},${b+1})`,`(${a+2},${b+1})`]), answer:0, explain:`Tổng $x+y$ phải $\le${ans}$.`, diff:d };
    });
    return p(qs2)();
  };

  const genHamSo = () => {
    const d = tier();
    if(d==='easy'){
      const a=ri(1,3), b=ri(-4,4), x0=ri(-2,3);
      const val = a*x0 + b;
      const choices = sh([`${val}`,`${val+1}`,`${val-1}`,`${val+2}`]);
      return { type:'mcq', topic:topicId, stem:`Cho $f(x)=${a}x${b>=0?'+':''}${b}$. Tính $f(${x0})$:`, choices, answer:choices.indexOf(`${val}`), explain:`$f(${x0}) = ${a}\\cdot${x0}${b>=0?'+':''}${b} = ${val}$`, diff:d };
    }
    if(d==='medium'){
      const cases = [
        { f:`\\frac{\\sqrt{x+${ri(1,3)}}}{x-${ri(2,4)}}`, a:`$[-${ri(1,3)},${ri(2,4)})\\cup(${ri(2,4)},+\\infty)$`, e:'' },
        { f:`\\frac{x+${ri(1,3)}}{x^2-${ri(4,9)}}`, a:`$\\mathbb{R}\\setminus\\{${ri(-3,-1)},${ri(1,3)}\\}$`, e:'' },
      ];
      const c = p(cases);
      return { type:'mcq', topic:topicId, stem:`Tập xác định hàm $y=${c.f}$:`, choices:sh([c.a,`$\\mathbb{R}$`,`$(-\\infty,2)$`,`$[0,+\\infty)$`]), answer:0, explain:`Giải điều kiện xác định.`, diff:d };
    }
    const a=ri(1,3);
    return { type:'mcq', topic:topicId, stem:`Hàm $y=${a}x+${ri(-5,5)}$ đồng biến trên:`, choices:[`$\\mathbb{R}$`,`$(${ri(0,3)},+\\infty)$`,`$(-\\infty,${ri(-3,0)})$`,`Không ĐB`], answer:0, explain:`$a=${a}>0$ nên ĐB trên $\\mathbb{R}$.`, diff:d };
  };

  const genHamSoBacHai = () => {
    const d = tier();
    if(d==='easy'){
      const a=ri(1,2), b=ri(-4,4), c=ri(-3,3);
      const x0 = -b/(2*a); const y0 = Math.round((4*a*c - b*b)/(4*a)*10)/10;
      const choices = sh([`$${y0}$`,`$${y0+1}$`,`$${y0-1}$`,`$${y0+2}$`]);
      return { type:'mcq', topic:topicId, stem:`Hàm $y=${a}x^2${b>=0?'+':''}${b}x${c>=0?'+':''}${c}$ có tung độ đỉnh:`, choices, answer:choices.indexOf(`$${y0}$`), explain:`$y_0=\\frac{-\\Delta}{4a}=${y0}$.`, diff:d };
    }
    if(d==='medium'){
      const a=ri(-3,-1), b=ri(2,4), c=ri(1,3);
      const x0 = -b/(2*a); const y0 = Math.round((4*a*c - b*b)/(4*a)*10)/10;
      const choices = sh([`$${y0}$`,`$${y0+2}$`,`$${y0-2}$`,`$${c}$`]);
      return { type:'mcq', topic:topicId, stem:`Hàm $y=${a}x^2${b>=0?'+':''}${b}x${c>=0?'+':''}${c}$ có GTLN:`, choices, answer:choices.indexOf(`$${y0}$`), explain:`$a<0$, $y_{max}=y(${x0})=${y0}$.`, diff:d };
    }
    return { type:'mcq', topic:topicId, stem:`Hàm $y=x^2-2mx+3$ có trục đx $x=1$. $m$ bằng:`, choices:['1','2','-1','0'], answer:0, explain:`$x=-\\frac{-2m}{2}=m$, vậy $m=1$.`, diff:d };
  };

  const genPhuongTrinh = () => {
    const d = tier();
    const staticE = () => ({ type:'mcq', topic:topicId, stem:'PT $2x+3=7$ có nghiệm:', choices:sh(['2','3','4','5']), answer:0, explain:'$2x=4\\Rightarrow x=2$.', diff:d });
    const staticM = () => ({ type:'mcq', topic:topicId, stem:'PT $\\sqrt{2x+1}=3$ có nghiệm:', choices:sh(['4','2','3','5']), answer:0, explain:'BP 2 vế: $2x+1=9\\Rightarrow x=4$.', diff:d });
    const staticH = () => ({ type:'mcq', topic:topicId, stem:'PT $\\frac{2x+1}{x-2}=1$ có nghiệm:', choices:sh(['-3','-2','2','3']), answer:0, explain:'$2x+1=x-2\\Rightarrow x=-3$.', diff:d });
    if(d==='easy'){
      const a=ri(1,3), b=ri(-5,5), c=ri(-5,5);
      const x = (c-b)/a;
      if(!Number.isInteger(x)) return staticE();
      const choices = sh([`${x}`,`${x+1}`,`${x-1}`,`${x+2}`]);
      return { type:'mcq', topic:topicId, stem:`PT $${a}x${b>=0?'+':''}${b}=${c}$ có nghiệm:`, choices, answer:choices.indexOf(`${x}`), explain:`$x=\\frac{${c}-(${b})}{${a}} = ${x}$.`, diff:d };
    }
    if(d==='medium'){
      const a=ri(1,3), b=ri(1,4);
      const n = ri(2,4);
      const x = (n*n - b)/a;
      if(!Number.isInteger(x)) return staticM();
      const choices = sh([`${x}`,`${x+1}`,`${x-1}`,`${x+2}`]);
      return { type:'mcq', topic:topicId, stem:`PT $\\sqrt{${a}x+${b}} = ${n}$ có nghiệm:`, choices, answer:choices.indexOf(`${x}`), explain:`BP 2 vế: ${a}x+${b}=${n*n} \\Rightarrow x=${x}.`, diff:d };
    }
    const a1=ri(1,3), b1=ri(1,4), c=ri(2,4);
    const x = b1/(a1-1);
    if(!Number.isInteger(x)||x===c) return staticH();
    return { type:'mcq', topic:topicId, stem:`PT $\\frac{${a1}x+${b1}}{x-${c}} = 1$:`, choices:sh([`${x}`,`${x+1}`,`${x-1}`,`${x+2}`]), answer:0, explain:`ĐK: $x\\neq${c}$. ${a1}x+${b1}=x-${c} \\Rightarrow ${a1-1}x=-${c}-${b1} \\Rightarrow x=${x}.`, diff:d };
  };

  const genHePT = () => {
    const d = tier();
    const x=ri(1,5), y=ri(1,5);
    const a1=ri(1,3), b1=ri(1,3); const c1 = a1*x + b1*y;
    let a2,b2,c2;
    do{ a2=ri(1,3); b2=ri(1,3); c2=a2*x+b2*y; }while(a1*b2===a2*b1);
    const ans = `(${x},${y})`;
    const choices = sh([ans,`(${y},${x})`,`(${x+1},${y-1})`,`(${x-1},${y+1})`]);
    return { type:'mcq', topic:topicId, stem:`Hệ $\\begin{cases}${a1}x+${b1}y=${c1}\\\\${a2}x+${b2}y=${c2}\\end{cases}$:`, choices, answer:choices.indexOf(ans), explain:`GPT được $x=${x}, y=${y}$.`, diff:d };
  };

  const genLuongGiac = () => {
    const d = tier();
    if(d==='easy'){
      const qs = [
        () => ({ stem:'$\\sin 30^\\circ$:', choices:sh(['$\\frac{1}{2}$','$\\frac{\\sqrt{3}}{2}$','$\\frac{\\sqrt{2}}{2}$','$\\frac{\\sqrt{3}}{3}$']), answer:0, explain:'$\\sin 30^\\circ = \\frac12$.' }),
        () => ({ stem:'$\\cos 60^\\circ$:', choices:sh(['$\\frac{1}{2}$','$\\frac{\\sqrt{3}}{2}$','$\\frac{\\sqrt{2}}{2}$','0']), answer:0, explain:'$\\cos 60^\\circ = \\frac12$.' }),
        () => ({ stem:'$\\tan 45^\\circ$:', choices:sh(['1','0','-1','$\\infty$']), answer:0, explain:'$\\tan 45^\\circ = 1$.' }),
        () => ({ stem:'$\\sin^2 x + \\cos^2 x$:', choices:sh(['1','0','2','-1']), answer:0, explain:'HĐT cơ bản.' }),
        () => ({ stem:'$\\cot 90^\\circ$:', choices:sh(['0','1','$\\infty$','-1']), answer:0, explain:'$\\cot 90^\\circ = 0$.' }),
        () => ({ stem:'$\\cos 0^\\circ$:', choices:sh(['1','0','-1','$\\frac12$']), answer:0, explain:'$\\cos 0^\\circ=1$.' }),
      ];
      const q = p(qs)();
      q.type='mcq'; q.topic=topicId; q.diff=d; return q;
    }
    if(d==='medium'){
      const qs = [
        () => ({ stem:'Cho $\\sin\\alpha=\\frac35$, $0<\\alpha<\\frac\\pi2$. $\\cos\\alpha$:', choices:sh(['$\\frac45$','$\\frac25$','$-\\frac45$','$\\frac{\\sqrt{34}}5$']), answer:0, explain:'$\\cos^2\\alpha=1-\\frac{9}{25}=\\frac{16}{25}$, $\\alpha$ nhọn nên $\\cos\\alpha=\\frac45$.' }),
        () => ({ stem:'$\\cos 120^\\circ$:', choices:sh(['$-\\frac12$','$\\frac12$','$-\\frac{\\sqrt{3}}2$','$\\frac{\\sqrt{3}}2$']), answer:0, explain:'$\\cos(180-60)=-\\cos60=-\\frac12$.' }),
        () => ({ stem:'$\\sin(\\pi-x)$:', choices:sh(['$\\sin x$','$-\\sin x$','$\\cos x$','$-\\cos x$']), answer:0, explain:'Cung bù: $\\sin(\\pi-x)=\\sin x$.' }),
        () => ({ stem:'$\\tan(\\pi+\\alpha)$:', choices:sh(['$\\tan\\alpha$','$-\\tan\\alpha$','$\\cot\\alpha$','$-\\cot\\alpha$']), answer:0, explain:'Cung hơn $\\pi$: $\\tan(\\pi+\\alpha)=\\tan\\alpha$.' }),
      ];
      const q = p(qs)();
      q.type='mcq'; q.topic=topicId; q.diff=d; return q;
    }
    const hards = [];
    hards.push(() => ({ type:'mcq', topic:topicId, stem:'$\\sin 2x$ bằng:', choices:sh(['$2\\sin x\\cos x$','$\\sin^2x-\\cos^2x$','$2\\cos^2x-1$','$1-2\\sin^2x$']), answer:0, explain:'Công thức nhân đôi: $\\sin2x=2\\sin x\\cos x$.', diff:d }));
    hards.push(() => ({ type:'mcq', topic:topicId, stem:'$\\cos 2x$ bằng:', choices:sh(['$\\cos^2x-\\sin^2x$','$2\\sin x\\cos x$','$1+\\sin^2x$','$\\sin^2x-\\cos^2x$']), answer:0, explain:'$\\cos2x=\\cos^2x-\\sin^2x=2\\cos^2x-1=1-2\\sin^2x$.', diff:d }));
    hards.push(() => {
      const t = p(['\\sin','\\cos','\\tan']);
      const sign = p(['+','-']);
      return { type:'mcq', topic:topicId, stem:`$\\${t}(x+2\\pi)$ bằng:`, choices:sh([`$\\${t}x$`,`$-\\${t}x$`,`$\\${t}2x$`,`$1-\\${t}x$`]), answer:0, explain:'Chu kỳ $2\\pi$ nên giá trị lượng giác không đổi.', diff:d };
    });
    return p(hards)();
  };

  const genBatPTBacHai = () => {
    const d = tier();
    const staticEasy = () => ({ type:'mcq', topic:topicId, stem:'BPT $x^2-5x+6\\le 0$:', choices:sh(['$[2,3]$','$(-\\infty,2]\\cup[3,+\\infty)$','$(2,3)$','$\\emptyset$']), answer:0, explain:'$(x-2)(x-3)\\le0$, S=[2,3].', diff:d });
    const staticMedium = () => ({ type:'mcq', topic:topicId, stem:'BPT $x^2-4x+3>0$:', choices:sh(['$(-\\infty,1)\\cup(3,+\\infty)$','$(1,3)$','$\\mathbb{R}$','$\\emptyset$']), answer:0, explain:'$(x-1)(x-3)>0$, trái dấu trong (1,3).', diff:d });
    const staticHard = () => ({ type:'mcq', topic:topicId, stem:'Tìm $m$ để $x^2-2mx+4>0,\\forall x$:', choices:sh(['$-2<m<2$','$m<-2$ hoặc $m>2$','$\\mathbb{R}$','$m>0$']), answer:0, explain:'$\\Delta\'=m^2-4<0\\Rightarrow-2<m<2$.', diff:d });
    if(d==='easy'){
      const a=ri(1,2), b=ri(-7,-2), c=ri(2,5);
      const delta = b*b - 4*a*c;
      const sqrtD = Math.round(Math.sqrt(delta));
      const x1 = (-b-sqrtD)/(2*a), x2 = (-b+sqrtD)/(2*a);
      if(delta<=0 || !Number.isInteger(x1) || !Number.isInteger(x2)) return staticEasy();
      const choices = sh([`$[${x1},${x2}]$`,`$(-\\infty,${x1}]\\cup[${x2},+\\infty)$`,`$(${x1},${x2})$`,`$\\mathbb{R}$`]);
      return { type:'mcq', topic:topicId, stem:`BPT $x^2${-b>=0?'+':''}${-b}x${c>=0?'+':''}${c}\\le 0$:`, choices, answer:0, explain:`PT có nghiệm ${x1}, ${x2}, xét dấu tam thức.`, diff:d };
    }
    if(d==='medium'){
      const a=ri(1,2), b=ri(-4,4), c=ri(1,4);
      const delta = b*b - 4*a*c;
      const sqrtD = Math.round(Math.sqrt(delta));
      const x1 = (-b-sqrtD)/(2*a), x2 = (-b+sqrtD)/(2*a);
      if(delta<=0 || !Number.isInteger(x1) || !Number.isInteger(x2)) return staticMedium();
      const choices = sh([`$(-\\infty,${x1})\\cup(${x2},+\\infty)$`,`$(${x1},${x2})$`,`$\\mathbb{R}$`,`$\\emptyset$`]);
      return { type:'mcq', topic:topicId, stem:`BPT $${a}x^2${-b>=0?'+':''}${-b}x${c>=0?'+':''}${c}>0$:`, choices, answer:0, explain:`Tam thức dương ngoài khoảng 2 nghiệm ${x1}, ${x2}.`, diff:d };
    }
    const hards = [];
    hards.push(staticHard);
    hards.push(() => {
      const m = ri(1,4);
      return { type:'mcq', topic:topicId, stem:`Tìm $m$ để $x^2-${2*m}x+${m*m-1}\\le0$ có nghiệm:`, choices:sh([`$m\\in\\mathbb{R}$`,`$m>${m+1}$`,`$m<${m-1}$`,`$\\emptyset$`]), answer:0, explain:'$\\Delta=4m^2-4(m^2-1)=4>0$, luôn có nghiệm.', diff:d };
    });
    return p(hards)();
  };

  const gens = {
    'menh-de-tap-hop': genMenhDe,
    'bat-phuong-trinh': genBatPT,
    'ham-so': genHamSo,
    'ham-so-bac-hai': genHamSoBacHai,
    'phuong-trinh': genPhuongTrinh,
    'he-phuong-trinh': genHePT,
    'luong-giac': genLuongGiac,
    'bat-phuong-trinh-bac-hai': genBatPTBacHai,
  };
  return gens[topicId] ? gens[topicId]() : null;
};
