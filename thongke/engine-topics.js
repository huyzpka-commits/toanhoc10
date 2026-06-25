/* ===== THỐNG KÊ & XÁC SUẤT 10 — FULL TOPICS ===== */

APP.genQuestion = function(topicId, seed){
  const ri = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
  const p = arr => arr[ri(0,arr.length-1)];
  const sh = arr => { const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=ri(0,i); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const tier = () => { const t=Math.random(); return t<0.5?'easy':t<0.85?'medium':'hard'; };

  const genSoGanDungSaiSo = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const n = ri(1,5); const m = ri(2,3);
      const num = (Math.PI*(n+1)).toFixed(5);
      const nearest = Math.round(parseFloat(num)*100)/100;
      return { stem:`Số ${num}, quy tròn đến phần trăm:`, choices:sh([`${nearest}`,`${nearest+0.01}`,`${nearest-0.01}`,`${Math.round(parseFloat(num)*10)/10}`]), answer:0, explain:'Chữ số hàng phần nghìn quyết định.' };
    });
    qs.push(() => {
      const v = ri(10,50); const err = ri(1,5)/100;
      const rel = Math.round(err/v*10000)/100;
      return { stem:`Đo $l=${v}m\\pm${err}m$. Sai số tương đối:`, choices:sh([`${rel}%`,`${(rel+0.5).toFixed(2)}%`,`${(rel-0.5).toFixed(2)}%`,`${err*100}%`]), answer:0, explain:`$\\delta=\\frac{${err}}{${v}}\\approx${rel}\\%$` };
    });
    qs.push(() => {
      const choices = sh(['0.58%','1%','0.01%','0.1%']);
      return { stem:'Cao $h=1.72m\\pm0.01m$. Sai số tương đối:', choices, answer:0, explain:'$\\delta=\\frac{0.01}{1.72}\\approx0.58\\%$.' };
    });
    qs.push(() => {
      const choices = sh(['1.414','1.415','1.4142','1.41']);
      return { stem:'Số $\\sqrt{2}\\approx1.41421356$, quy tròn đến phần nghìn:', choices, answer:0, explain:'Chữ số thứ 4 sau phẩy là 2<5.' };
    });
    qs.push(() => {
      const choices = sh(['3','4','5','2']);
      return { stem:'Số $a=12.3456$ có sai số tuyệt đối $\\le0.005$. Số chữ số chắc:', choices, answer:0, explain:'Sai số <0.01 nên chữ số phần trăm trở lên chắc → 3 chữ số.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genBangPhanBoTanSo = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const n = ri(5,8); const arr = Array.from({length:n}, ()=>ri(3,9));
      const sum = arr.reduce((a,b)=>a+b,0);
      const mean = Math.round(sum/n*10)/10;
      return { stem:`Dãy: ${arr.join(', ')}. Số TBC:`, choices:sh([`${mean}`,`${Math.round((mean+1)*10)/10}`,`${Math.round((mean-1)*10)/10}`,`${sum}`]), answer:0, explain:`$\\bar{x}=\\frac{${sum}}{${n}}=${mean}$` };
    });
    qs.push(() => {
      const arr = Array.from({length:ri(5,7)}, ()=>ri(3,8));
      const freq = {}; arr.forEach(v => freq[v]=(freq[v]||0)+1);
      const maxFreq = Math.max(...Object.values(freq));
      const modes = Object.keys(freq).filter(k => freq[k]===maxFreq).join(',');
      return { stem:`Dãy: ${arr.join(', ')}. Mốt:`, choices:sh([modes,`${arr[0]}`,`${arr[arr.length-1]}`,`Không có mốt`]), answer:0, explain:'Giá trị xuất hiện nhiều nhất.' };
    });
    qs.push(() => {
      const arr = Array.from({length:ri(5,7)}, ()=>ri(3,8));
      const sorted = [...arr].sort((a,b)=>a-b);
      const max = sorted[sorted.length-1], min = sorted[0];
      const range = max-min;
      return { stem:`Dãy: ${arr.join(', ')}. Khoảng biến thiên:`, choices:sh([`${range}`,`${range+1}`,`${range-1}`,`${max+min}`]), answer:0, explain:`$R=${max}-${min}=${range}$` };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genTrungBinhTrungViMo = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const n = ri(5,8); const arr = Array.from({length:n}, ()=>ri(3,9));
      const sum = arr.reduce((a,b)=>a+b,0);
      const mean = Math.round(sum/n*10)/10;
      return { stem:`Dãy: ${arr.join(', ')}. Số trung bình cộng:`, choices:sh([`${mean}`,`${mean+1}`,`${mean-1}`,`${sum}`]), answer:0, explain:`$\\bar{x}=\\frac{${sum}}{${n}}=${mean}$` };
    });
    qs.push(() => {
      const sorted = Array.from({length:ri(5,7)}, ()=>ri(2,9)).sort((a,b)=>a-b);
      const n = sorted.length;
      const median = n%2===1?sorted[Math.floor(n/2)]:(sorted[n/2-1]+sorted[n/2])/2;
      const medianStr = `${median}`;
      return { stem:`Sắp xếp: ${sorted.join(', ')}. Trung vị:`, choices:sh([medianStr,`${sorted[0]}`,`${sorted[n-1]}`,`${sorted[Math.floor(n/3)]}`]), answer:0, explain:'Trung vị là giá trị ở giữa.' };
    });
    qs.push(() => {
      const arr = Array.from({length:ri(5,6)}, ()=>ri(3,8));
      const freq = {}; arr.forEach(v => freq[v]=(freq[v]||0)+1);
      const maxFreq = Math.max(...Object.values(freq));
      const modes = Object.keys(freq).filter(k => freq[k]===maxFreq).join(',');
      return { stem:`Dãy: ${arr.join(', ')}. Mốt:`, choices:sh([modes,`${arr[0]}`,`${arr[arr.length-1]}`,`Không có mốt`]), answer:0, explain:'Giá trị xuất hiện nhiều nhất.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genPhuongSaiDoLechChuan = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const arr = Array.from({length:ri(5,7)}, ()=>ri(4,8));
      const mean = arr.reduce((a,b)=>a+b,0)/arr.length;
      const varVal = Math.round(arr.reduce((s,x)=>s+(x-mean)**2,0)/arr.length*10)/10;
      return { stem:`Dãy: ${arr.join(', ')}. Phương sai:`, choices:sh([`${varVal}`,`${Math.round((varVal+1)*10)/10}`,`${Math.round((varVal-1)*10)/10}`,`${Math.round(Math.sqrt(varVal)*10)/10}`]), answer:0, explain:`$s^2=\\frac{1}{${arr.length}}\\sum(x_i-\\bar{x})^2$` };
    });
    qs.push(() => {
      const arr = Array.from({length:ri(5,7)}, ()=>ri(4,8));
      const mean = arr.reduce((a,b)=>a+b,0)/arr.length;
      const varVal = arr.reduce((s,x)=>s+(x-mean)**2,0)/arr.length;
      const std = Math.round(Math.sqrt(varVal)*10)/10;
      return { stem:`Dãy: ${arr.join(', ')}. Độ lệch chuẩn:`, choices:sh([`${std}`,`${Math.round((std+1)*10)/10}`,`${Math.round((std-1)*10)/10}`,`${Math.round(varVal*10)/10}`]), answer:0, explain:`$s=\\sqrt{s^2}$` };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genXacSuatCoDien = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      return { stem:'Gieo đồng xu, xác suất mặt ngửa:', choices:sh(['$\\frac{1}{2}$','$\\frac{1}{3}$','$\\frac{1}{4}$','1']), answer:0, explain:'$\\Omega=\\{S,N\\}$, $P=\\frac12$.' };
    });
    qs.push(() => {
      return { stem:'Gieo xúc xắc, xác suất mặt 3 chấm:', choices:sh(['$\\frac{1}{6}$','$\\frac{1}{3}$','$\\frac{1}{2}$','$\\frac{1}{4}$']), answer:0, explain:'$|\\Omega|=6$, $P=\\frac16$.' };
    });
    qs.push(() => {
      const r=ri(3,6), b=ri(4,7);
      const pVal = `$\\frac{${r}}{${r+b}}$`;
      return { stem:`${r} bi đỏ, ${b} bi xanh, lấy 1 bi. XS bi đỏ:`, choices:sh([pVal,`$\\frac{${b}}{${r+b}}$`,`$\\frac{${r}}{${b}}$`,`$\\frac{${r+b}}{${r}}$`]), answer:0, explain:`$P=\\frac{${r}}{${r+b}}$` };
    });
    qs.push(() => {
      return { stem:'Gieo 2 đồng xu, xác suất 1 sấp 1 ngửa:', choices:sh(['$\\frac{1}{2}$','$\\frac{1}{4}$','$\\frac{1}{3}$','$\\frac{3}{4}$']), answer:0, explain:'Có 2/4 kết quả thuận lợi.' };
    });
    qs.push(() => {
      return { stem:'Xác suất biến cố chắc chắn:', choices:sh(['1','0','$\\frac{1}{2}$','$\\frac{1}{4}$']), answer:0, explain:'Luôn xảy ra nên $P=1$.' };
    });
    qs.push(() => {
      const total = ri(6,10); const good = ri(2,total-2);
      const p = good/total;
      return { stem:`Hộp ${total} bi, ${good} bi xanh. XS lấy được bi xanh:`, choices:sh([`${p}`,`${Math.round((p+0.1)*10)/10}`,`${Math.round((p-0.1)*10)/10}`,`${1-p}`]), answer:0, explain:`$P=\\frac{${good}}{${total}}=${p}$` };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genQuyTacCongNhan = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      return { stem:'Gieo 2 xúc xắc, XS tổng = 7:', choices:sh(['$\\frac{1}{6}$','$\\frac{1}{12}$','$\\frac{5}{36}$','$\\frac{1}{9}$']), answer:0, explain:'Có 6 cặp trong 36, $P=\\frac{6}{36}=\\frac16$.' };
    });
    qs.push(() => {
      return { stem:'Bắn trúng bia P=0.8. 2 phát độc lập. Cả 2 trúng:', choices:sh(['0.64','0.16','0.8','0.4']), answer:0, explain:'$P=0.8\\times0.8=0.64$.' };
    });
    qs.push(() => {
      const p1 = p([0.3, 0.4, 0.5, 0.6, 0.7]);
      const p2 = p([0.3, 0.4, 0.5, 0.6, 0.7]);
      const ans = Math.round(p1*p2*100)/100;
      return { stem:`2 xạ thủ bắn độc lập. P1=${p1}, P2=${p2}. XS cả 2 trúng:`, choices:sh([`${ans}`,`${Math.round((ans+0.1)*100)/100}`,`${Math.round((ans-0.1)*100)/100}`,`${p1+p2}`]), answer:0, explain:`$P=${p1}\\times${p2}=${ans}$` };
    });
    qs.push(() => {
      const r=ri(2,5), b=ri(2,5), k=ri(2,3);
      const total = r+b;
      const ans = k===2 ? Math.round((r/total)*((r-1)/(total-1))*100)/100 : Math.round((r/total)*100)/100;
      return { stem:`Hộp ${r} đỏ, ${b} xanh. Lấy ${k} bi không hoàn lại. XS cả ${k} đều đỏ:`, choices:sh([`${ans}`,`${Math.round((ans+0.1)*100)/100}`,`${Math.round((ans-0.1)*100)/100}`,`${Math.round((r/total)*100)/100}`]), answer:0, explain:`$P=\\frac{${r}}{${total}}\\times\\frac{${r-1}}{${total-1}}$ (nếu k=2).`, diff:d };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genXacSuatCoDieuKien = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const r=ri(2,5), b=ri(2,5);
      const ans = Math.round((b/(r+b))*100)/100;
      return { stem:`Hộp ${r} đỏ, ${b} xanh. Lấy 1 đỏ (không hoàn lại). XS lần 2 xanh:`, choices:sh([`${ans}`,`${Math.round((ans+0.1)*100)/100}`,`${Math.round((ans-0.1)*100)/100}`,`${b/(r+b)}`]), answer:0, explain:`Sau khi lấy 1 đỏ còn ${b} xanh / ${r+b-1} bi.`, diff:d };
    });
    qs.push(() => {
      const pA = p([0.4,0.5,0.6]); const pB = p([0.3,0.4,0.5]);
      const ans = Math.round((pA*pB)*100)/100;
      return { stem:`P(A)=${pA}, P(B|A)=${pB}. XS A và B cùng xảy ra:`, choices:sh([`${ans}`,`${pA+pB}`,`${pA-pB}`,`${pA*pB+0.1}`]), answer:0, explain:'$P(A\\cap B)=P(A)P(B|A)$.' };
    });
    qs.push(() => {
      return { stem:'Quy tắc nhân xác suất: $P(A \\cap B)=$', choices:sh(['$P(A)P(B|A)$','$P(A)+P(B)$','$P(A)-P(B)$','$P(A)P(B)$']), answer:0, explain:'$P(A \\cap B)=P(A)P(B|A)$.' };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const genBaiToanThucTe = () => {
    const d = tier();
    const qs = [];
    qs.push(() => {
      const arr = Array.from({length:ri(5,6)}, ()=>ri(5,10));
      const sum = arr.reduce((a,b)=>a+b,0);
      const mean = Math.round(sum/arr.length*10)/10;
      return { stem:`Điểm: ${arr.join(', ')}. Điểm TB:`, choices:sh([`${mean}`,`${mean+1}`,`${mean-1}`,`${sum}`]), answer:0, explain:`$\\bar{x}=\\frac{${sum}}{${arr.length}}=${mean}$` };
    });
    qs.push(() => {
      const a=ri(2,5), b=ri(3,6);
      return { stem:`${a} đường A→B, ${b} đường B→C. Số cách A→C qua B:`, choices:sh([`${a*b}`,`${a+b}`,`${a}`,`${b}`]), answer:0, explain:`${a}\\times${b}=${a*b} cách.` };
    });
    qs.push(() => {
      const nam=ri(10,20), nu=ri(10,20);
      return { stem:`Lớp ${nam} nam, ${nu} nữ. Chọn 1 lớp trưởng. Số cách:`, choices:sh([`${nam+nu}`,`${nam}`,`${nu}`,`${nam*nu}`]), answer:0, explain:`${nam}+${nu}=${nam+nu} cách.` };
    });
    qs.push(() => {
      const arr = Array.from({length:ri(5,6)}, ()=>ri(3,8));
      const freq = {}; arr.forEach(v => freq[v]=(freq[v]||0)+1);
      const maxFreq = Math.max(...Object.values(freq));
      const modes = Object.keys(freq).filter(k => freq[k]===maxFreq).join(',');
      return { stem:`Dãy: ${arr.join(', ')}. Mốt:`, choices:sh([modes,`${arr[0]}`,`${arr[arr.length-1]}`,`Không có mốt`]), answer:0, explain:'Giá trị xuất hiện nhiều nhất.' };
    });
    qs.push(() => {
      const prob = p([0.2,0.3,0.4,0.5]);
      const n = ri(3,5);
      const ans = Math.round(prob*n*100)/100;
      return { stem:`Mỗi ngày HS đi học muộn với XS ${prob}. Trong ${n} ngày, số ngày đi học muộn trung bình:`, choices:sh([`${ans}`,`${n}`,`${prob}`,`${n*prob+1}`]), answer:0, explain:`Kỳ vọng = $n\\times p=${ans}$` };
    });
    const q = p(qs)(); q.type='mcq'; q.topic=topicId; q.diff=d; return q;
  };

  const gens = {
    'so-gan-dung-sai-so': genSoGanDungSaiSo,
    'bang-phan-bo-tan-so': genBangPhanBoTanSo,
    'trung-binh-trung-vi-mo': genTrungBinhTrungViMo,
    'phuong-sai-do-lech-chuan': genPhuongSaiDoLechChuan,
    'xac-suat-co-dien': genXacSuatCoDien,
    'quy-tac-cong-nhan': genQuyTacCongNhan,
    'xac-suat-co-dieu-kien': genXacSuatCoDieuKien,
    'bai-toan-thuc-te': genBaiToanThucTe,
  };
  return gens[topicId] ? gens[topicId]() : null;
};
