/* ===== HÌNH HỌC 10 — FULL TOPICS ===== */

APP.genQuestion = function(topicId, seed){
  const ri = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
  const p = arr => arr[ri(0,arr.length-1)];
  const sh = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=ri(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const tier = () => { const t=Math.random(); return t<0.5?'easy':t<0.85?'medium':'hard'; };

  const genVectorTongHieu = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const xA=ri(-3,3), yA=ri(-3,3), dx=ri(1,5), dy=ri(1,5);
      const xB=xA+dx, yB=yA+dy;
      const ans = `(${dx},${dy})`;
      return { stem:`$A(${xA},${yA})$, $B(${xB},${yB})$. $\\overrightarrow{AB}$:`, choices:sh([ans,`(${dy},${dx})`,`(${-dx},${-dy})`,`(${dx+1},${dy-1})`]), answer:0, explain:'$\\overrightarrow{AB}=(x_B-x_A,y_B-y_A)$.' };
    });
    qs.push(() => {
      const a=ri(1,4), a2=ri(-4,-1), b=ri(2,5), b2=ri(-3,3);
      const ans = `(${a+a2},${b+b2})`;
      return { stem:`$\\vec{a}=(${a},${a2})$, $\\vec{b}=(${b},${b2})$. $\\vec{a}+\\vec{b}$:`, choices:sh([ans,`(${a+b},${a2+b2})`,`(${a-a2},${b-b2})`,`(${a+b2},${b+a2})`]), answer:0, explain:'Cộng từng tọa độ.' };
    });
    qs.push(() => {
      const a=ri(1,4), a2=ri(-4,-1), b=ri(2,5), b2=ri(-3,3);
      const ans = `(${a-b},${a2-b2})`;
      return { stem:`$\\vec{a}=(${a},${a2})$, $\\vec{b}=(${b},${b2})$. $\\vec{a}-\\vec{b}$:`, choices:sh([ans,`(${a+b},${a2+b2})`,`(${b-a},${b2-a2})`,`(${a-b2},${a2-b})`]), answer:0, explain:'$\\vec{a}-\\vec{b}=(a_1-b_1,a_2-b_2)$.' };
    });
    qs.push(() => {
      const xA=ri(-3,3), yA=ri(-3,3), xB=ri(1,5), yB=ri(1,5);
      const xM = (xA+xB)/2, yM = (yA+yB)/2;
      const ans = Number.isInteger(xM)?`(${xM},${yM})`:`(${xA+xB},${yA+yB})`;
      return { stem:`Trung điểm AB với $A(${xA},${yA})$, $B(${xB},${yB})$:`, choices:sh([ans,`(${xA},${yB})`,`(${xB},${yA})`,`(${xA+xB},${yA+yB})`]), answer:0, explain:'$M=(\\frac{x_A+x_B}2,\\frac{y_A+y_B}2)$.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genTichVectorSo = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const k=ri(2,4), x=ri(-3,3), y=ri(-4,4);
      const ans = `(${k*x},${k*y})`;
      return { stem:`$\\vec{v}=(${x},${y})$. Tọa độ $${k}\\vec{v}$:`, choices:sh([ans,`(${k*x+1},${k*y})`,`(${x+k},${y+k})`,`(${k*x},${k*y+1})`]), answer:0, explain:'Nhân từng tọa độ với số.' };
    });
    qs.push(() => {
      const x=ri(-3,3), y=ri(-4,4);
      const ans = `(${-x},${-y})`;
      return { stem:`$\\vec{a}=(${x},${y})$. Tọa độ $-\\vec{a}$:`, choices:sh([ans,`(${x},${y})`,`(${-x},${y})`,`(${x},${-y})`]), answer:0, explain:'$-\\vec{a}=(-x,-y)$.' };
    });
    qs.push(() => {
      const A=ri(1,3), B=ri(2,5), k=ri(2,3);
      const ans = `(${k*A},${k*B})`;
      return { stem:`$\\overrightarrow{AB}=(${A},${B})$. Tọa độ $${k}\\overrightarrow{AB}$:`, choices:sh([ans,`(${A+k},${B+k})`,`(${k*A+1},${k*B})`,`(${A},${k*B})`]), answer:0, explain:'Nhân từng tọa độ với ${k}.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genToaDoVector = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const a=ri(1,5), b=ri(1,5);
      const ans = Math.round(Math.sqrt(a*a+b*b)*10)/10;
      return { stem:`$|\\vec{a}|$ với $\\vec{a}=(${a},${b})$:`, choices:sh([`${ans}`,`${Math.round((ans+1)*10)/10}`,`${Math.round((ans-1)*10)/10}`,`${a+b}`]), answer:0, explain:`$|\\vec{a}|=\\sqrt{${a}^2+${b}^2}=\\sqrt{${a*a+b*b}}\\approx${ans}$` };
    });
    qs.push(() => {
      const xA=ri(-3,3), yA=ri(-3,3), xB=ri(-3,3), yB=ri(-3,3);
      const dist = Math.round(Math.sqrt((xB-xA)**2+(yB-yA)**2)*10)/10;
      return { stem:`Khoảng cách $A(${xA},${yA})$, $B(${xB},${yB})$:`, choices:sh([`${dist}`,`${Math.round((dist+1)*10)/10}`,`${Math.round((dist-1)*10)/10}`,`${Math.abs(xB-xA)+Math.abs(yB-yA)}`]), answer:0, explain:'$AB=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$.' };
    });
    qs.push(() => {
      const a=ri(-3,3), b=ri(-3,3), c=ri(-3,3), d=ri(-3,3);
      const ans = a*c + b*d;
      return { stem:`$\\vec{a}=(${a},${b})$, $\\vec{b}=(${c},${d})$. $\\vec{a}\\cdot\\vec{b}$:`, choices:sh([`${ans}`,`${ans+1}`,`${ans-1}`,`${-ans}`]), answer:0, explain:'$\\vec{a}\\cdot\\vec{b}=ac+bd$.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genTichVoHuong = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const a=ri(1,3), b=ri(1,3);
      return { stem:`$\\vec{a}=(1,0)$, $\\vec{b}=(0,1)$. Góc giữa 2 vector:`, choices:sh(['$90^\\circ$','$0^\\circ$','$45^\\circ$','$180^\\circ$']), answer:0, explain:'Tích vô hướng = 0, góc $90^\\circ$.' };
    });
    qs.push(() => {
      const a=ri(1,3), b=ri(1,3);
      return { stem:`$\\vec{a}=(${a},0)$, $\\vec{b}=(0,${b})$. Góc giữa 2 vector:`, choices:sh(['$90^\\circ$','$0^\\circ$','$45^\\circ$','$60^\\circ$']), answer:0, explain:'Tích vô hướng = 0, góc $90^\\circ$.' };
    });
    qs.push(() => {
      const a=ri(1,3), b=ri(1,3), c=ri(1,3), d=ri(1,3);
      const dot = a*c + b*d;
      const ma = Math.sqrt(a*a+b*b), mb = Math.sqrt(c*c+d*d);
      const cos = dot/(ma*mb);
      const angle = Math.round(Math.acos(cos)*180/Math.PI);
      return { stem:`$\\vec{a}=(${a},${b})$, $\\vec{b}=(${c},${d})$. $\\cos(\\vec{a},\\vec{b})$:`, choices:sh([`${Math.round(cos*100)/100}`,`${Math.round((cos+0.1)*100)/100}`,`${Math.round((cos-0.1)*100)/100}`,`${angle}`]), answer:0, explain:'$\\cos=\\frac{\\vec{a}\\cdot\\vec{b}}{|\\vec{a}||\\vec{b}|}$.' };
    });
    qs.push(() => {
      return { stem:`$\\vec{a}\\cdot\\vec{b}=0$ thì 2 vector:`, choices:sh(['Vuông góc','Cùng hướng','Ngược hướng','Song song']), answer:0, explain:'Tích vô hướng bằng 0 thì 2 vector vuông góc.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genHeThucLuongTamGiac = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const a=ri(3,6), b=ri(4,8);
      const c = Math.round(Math.sqrt(a*a+b*b)*10)/10;
      return { stem:`Tam giác vuông, cạnh góc vuông ${a}, ${b}. Cạnh huyền:`, choices:sh([`${c}`,`${Math.round((c+1)*10)/10}`,`${Math.round((c-1)*10)/10}`,`${a+b}`]), answer:0, explain:`$c=\\sqrt{${a}^2+${b}^2}\\approx${c}$` };
    });
    qs.push(() => {
      const a=ri(3,7), h=ri(3,7);
      const s = Math.round(a*h/2*10)/10;
      return { stem:`Tam giác, đáy ${a}, cao ${h}. Diện tích:`, choices:sh([`${s}`,`${a*h}`,`${s+1}`,`${Math.round(s*2)}`]), answer:0, explain:`$S=\\frac12\\cdot${a}\\cdot${h}=${s}$` };
    });
    qs.push(() => {
      const a=ri(5,9), b=ri(5,9), C=ri(30,150);
      const c2 = a*a+b*b-2*a*b*Math.cos(C*Math.PI/180);
      if(c2<=0) return qs[0]();
      const c = Math.round(Math.sqrt(c2)*10)/10;
      return { stem:`Tam giác $AB=${a}$, $AC=${b}$, $\\widehat{A}=${C}^\\circ$. $BC$:`, choices:sh([`${c}`,`${Math.round((c+1)*10)/10}`,`${Math.round((c-1)*10)/10}`,`${Math.round((c+0.5)*10)/10}`]), answer:0, explain:`Định lý cos: $BC^2=${a}^2+${b}^2-2\\cdot${a}\\cdot${b}\\cdot\\cos${C}^\\circ$` };
    });
    qs.push(() => {
      const A=ri(30,70), B=ri(40,80), a=ri(5,10);
      const C = 180-A-B;
      const b = Math.round(a*Math.sin(B*Math.PI/180)/Math.sin(A*Math.PI/180)*10)/10;
      return { stem:`Tam giác $A=${A}^\\circ$, $B=${B}^\\circ$, $BC=${a}$. $AC$:`, choices:sh([`${b}`,`${b+0.5}`,`${b-0.5}`,`${b+1}`]), answer:0, explain:`Định lý sin: $\\frac{AC}{\\sin B}=\\frac{BC}{\\sin A}$` };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genPhuongTrinhDuongThang = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const a=ri(1,3), b=ri(1,3), c=ri(-5,5);
      return { stem:`Đường $${a}x+${b}y${c>=0?'+':''}${c}=0$ có VTPT:`, choices:sh([`(${a},${b})`,`(${b},${a})`,`(${-a},${b})`,`(${a},${c})`]), answer:0, explain:'VTPT là $(a,b)$ từ PT $ax+by+c=0$.' };
    });
    qs.push(() => {
      const x0=ri(-2,2), y0=ri(-2,2), a=ri(1,3), b=ri(1,3);
      return { stem:`Đường qua $A(${x0},${y0})$, VTCP $(${a},${b})$ có PT tham số:`, choices:[`$\\begin{cases}x=${x0}+${a}t\\\\y=${y0}+${b}t\\end{cases}$`,`$\\begin{cases}x=${a}+${x0}t\\\\y=${b}+${y0}t\\end{cases}$`,`$\\begin{cases}x=${x0}+${b}t\\\\y=${y0}+${a}t\\end{cases}$`,`$\\begin{cases}x=${a}+${b}t\\\\y=${x0}+${y0}t\\end{cases}$`], answer:0, explain:'PT tham số: $x=x_0+at, y=y_0+bt$.' };
    });
    qs.push(() => {
      const k=ri(1,4), m=ri(-3,3);
      return { stem:`Đường $y=${k}x${m>=0?'+':''}${m}$ có hệ số góc:`, choices:sh([`${k}`,`${m}`,`${-k}`,`${k+1}`]), answer:0, explain:'$y=kx+m$ có hệ số góc $k$.' };
    });
    qs.push(() => {
      const a=ri(1,4), b=ri(1,4), x0=ri(-3,3), y0=ri(-3,3);
      const dist = Math.round(Math.abs(a*x0+b*y0+ri(-3,3))/Math.sqrt(a*a+b*b)*10)/10;
      return { stem:`Khoảng cách từ $M(${x0},${y0})$ đến $${a}x+${b}y+${ri(-5,5)}=0$:`, choices:sh([`${dist}`,`${Math.round((dist+1)*10)/10}`,`${Math.round((dist-1)*10)/10}`,`${Math.round((dist+0.5)*10)/10}`]), answer:0, explain:'$d=\\frac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}$.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genViTriTuongDoiKhoangCach = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      return { stem:`$d_1: x-y+1=0$, $d_2: 2x-2y+3=0$. $d_1$ và $d_2$:`, choices:sh(['Song song','Cắt nhau','Trùng nhau','Vuông góc']), answer:0, explain:'$\\frac{1}{2}=\\frac{-1}{-2}\\neq\\frac{1}{3}$, nên song song.' };
    });
    qs.push(() => {
      return { stem:`$d_1: x+y=0$, $d_2: x-y+1=0$. $d_1$ và $d_2$:`, choices:sh(['Vuông góc','Song song','Trùng nhau','Cắt nhau']), answer:0, explain:'VTPT $(1,1)$ và $(1,-1)$ tích vô hướng = 0, vuông góc.' };
    });
    qs.push(() => {
      const a=ri(1,4), b=ri(1,4), c=ri(-5,5), x0=ri(-3,3), y0=ri(-3,3);
      const dist = Math.round(Math.abs(a*x0+b*y0+c)/Math.sqrt(a*a+b*b)*10)/10;
      return { stem:`Khoảng cách từ $M(${x0},${y0})$ đến $${a}x+${b}y${c>=0?'+':''}${c}=0$:`, choices:sh([`${dist}`,`${Math.round((dist+1)*10)/10}`,`${Math.round((dist-1)*10)/10}`,`${Math.round((dist+0.5)*10)/10}`]), answer:0, explain:'$d=\\frac{|ax_0+by_0+c|}{\\sqrt{a^2+b^2}}$.' };
    });
    qs.push(() => {
      return { stem:`Đường $d_1$ có hệ số góc $k_1=2$, $d_2$ có $k_2=-\\frac{1}{2}$. $d_1$ và $d_2$:`, choices:sh(['Vuông góc','Song song','Cắt nhau','Trùng nhau']), answer:0, explain:'$k_1k_2=-1$, vuông góc.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genDuongTron = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const a=ri(-3,3), b=ri(-3,3), r=ri(2,5);
      return { stem:`Đường tròn tâm $I(${a},${b})$, bán kính $${r}$:`, choices:sh([`$(x-${a})^2+(y-${b})^2=${r*r}$`,`$(x+${a})^2+(y+${b})^2=${r*r}$`,`$(x-${a})^2+(y-${b})^2=${r}$`,`$(x-${a})^2+(y+${b})^2=${r*r}$`]), answer:0, explain:'$(x-a)^2+(y-b)^2=R^2$.' };
    });
    qs.push(() => {
      const r=ri(2,5);
      return { stem:`$x^2+y^2=${r*r}$ có bán kính:`, choices:sh([`${r}`,`${r+1}`,`${r-1}`,`${r+2}`]), answer:0, explain:`$R=\\sqrt{${r*r}}=${r}$` };
    });
    qs.push(() => {
      const a=ri(-3,3), b=ri(-3,3), r=ri(2,4);
      const c=-2*a, d=-2*b, e=a*a+b*b-r*r;
      return { stem:`$x^2+y^2${c>=0?'+':''}${c}x${d>=0?'+':''}${d}y${e>=0?'+':''}${e}=0$ bán kính:`, choices:sh([`${r}`,`${r+1}`,`${r-1}`,`${Math.round(Math.sqrt(a*a+b*b)*10)/10}`]), answer:0, explain:`$R=\\sqrt{a^2+b^2-e}=${r}$` };
    });
    qs.push(() => {
      const a=ri(-3,3), b=ri(-3,3), r=ri(2,4);
      return { stem:`Đường tròn $(x-${a})^2+(y-${b})^2=${r*r}$ có tâm:`, choices:sh([`(${a},${b})`,`(${-a},${-b})`,`(${b},${a})`,`(${a+r},${b+r})`]), answer:0, explain:'Tâm $I(a,b)$.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genElip = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const a=ri(4,6), b=ri(2,4);
      return { stem:`Elip $\\frac{x^2}{${a*a}}+\\frac{y^2}{${b*b}}=1$, trục lớn:`, choices:sh([`${2*a}`,`${2*b}`,`${a}`,`${b}`]), answer:0, explain:`$2a=2\\cdot${a}=${2*a}$` };
    });
    qs.push(() => {
      const a=ri(4,6), b=ri(3,4);
      const c = Math.round(Math.sqrt(a*a-b*b));
      return { stem:`Elip $\\frac{x^2}{${a*a}}+\\frac{y^2}{${b*b}}=1$, tiêu cự:`, choices:sh([`${c}`,`${a}`,`${b}`,`${Math.round(c*2)}`]), answer:0, explain:`$c=\\sqrt{a^2-b^2}=\\sqrt{${a*a}-${b*b}}=${c}$` };
    });
    qs.push(() => {
      const a=ri(4,6), b=ri(3,4);
      const c = Math.round(Math.sqrt(a*a-b*b));
      return { stem:`Elip $\\frac{x^2}{${a*a}}+\\frac{y^2}{${b*b}}=1$, tâm sai:`, choices:sh([`$\\frac{${c}}{${a}}$`,`$\\frac{${b}}{${a}}$`,`$\\frac{${a}}{${b}}$`,`$\\frac{${c}}{${b}}$`]), answer:0, explain:`$e=\\frac{c}{a}=\\frac{${c}}{${a}}$` };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genHypebol = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const a=ri(3,5);
      return { stem:`Hypebol $\\frac{x^2}{${a*a}}-\\frac{y^2}{${a*a}}=1$ có $a$:`, choices:sh([`${a}`,`${a+1}`,`${a-1}`,`${2*a}`]), answer:0, explain:'$a=\\sqrt{...}$.' };
    });
    qs.push(() => {
      const a=ri(4,6), b=ri(3,4);
      const c = Math.round(Math.sqrt(a*a+b*b));
      return { stem:`Hypebol $\\frac{x^2}{${a*a}}-\\frac{y^2}{${b*b}}=1$ có $c$:`, choices:sh([`${c}`,`${a}`,`${b}`,`${Math.round(c*2)}`]), answer:0, explain:`$c=\\sqrt{a^2+b^2}=\\sqrt{${a*a}+${b*b}}=${c}$` };
    });
    qs.push(() => {
      const a=ri(4,6), b=ri(3,4);
      const c = Math.round(Math.sqrt(a*a+b*b));
      return { stem:`Hypebol $\\frac{x^2}{${a*a}}-\\frac{y^2}{${b*b}}=1$, tiêu cự:`, choices:sh([`${2*c}`,`${c}`,`${2*a}`,`${2*b}`]), answer:0, explain:`Tiêu cự $2c=${2*c}$` };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genParabol = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const p=ri(2,5);
      return { stem:`Parabol $y^2=${2*p}x$ có tham số $p$:`, choices:sh([`${p}`,`${2*p}`,`${p/2}`,`${p+1}`]), answer:0, explain:'$y^2=2px$ nên $p=${p}$.' };
    });
    qs.push(() => {
      const p=ri(2,5);
      return { stem:`Parabol $y^2=${2*p}x$ có tiêu điểm:`, choices:sh([`$(${p/2},0)$`,`$(${p},0)$`,`$(${2*p},0)$`,`$(0,${p})$`]), answer:0, explain:'Tiêu điểm $F(\\frac{p}{2},0)$.' };
    });
    qs.push(() => {
      const p=ri(2,5);
      return { stem:`Parabol $x^2=${2*p}y$ có trục đối xứng:`, choices:sh(['$Oy$','$Ox$','$y=x$','$y=-x$']), answer:0, explain:'$x^2=2py$ đối xứng qua $Oy$.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const gens = {
    'vector-tong-hieu': genVectorTongHieu,
    'tich-vector-so': genTichVectorSo,
    'toa-do-vector': genToaDoVector,
    'tich-vo-huong': genTichVoHuong,
    'he-thuc-luong-tam-giac': genHeThucLuongTamGiac,
    'phuong-trinh-duong-thang': genPhuongTrinhDuongThang,
    'vi-tri-tuong-doi-khoang-cach': genViTriTuongDoiKhoangCach,
    'duong-tron': genDuongTron,
    'elip': genElip,
    'hypebol': genHypebol,
    'parabol': genParabol,
  };
  return gens[topicId] ? gens[topicId]() : null;
};
