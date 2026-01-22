import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [activeFAQTab, setActiveFAQTab] = useState('기능사용');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const agree = document.getElementById('privacy-agree');
    if (!agree.checked) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    
    // Netlify Forms 제출
    const form = e.target;
    const formData = new FormData(form);
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        alert('상담 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
        form.reset();
      })
      .catch((error) => {
        alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error(error);
      });
  };

  const painPoints = [
    {
      icon: <i className="fa-solid fa-pen-slash"></i>,
      title: '미끄러운 판서감',
      description: '"분필 끝의 마찰력이 없어서 글씨가 날아갑니다. 정교한 수식 판서가 불가능합니다."',
    },
    {
      icon: <i className="fa-solid fa-chart-line"></i>,
      title: '복잡한 그래프',
      description: '"함수 그래프 하나 그리는데 메뉴를 3번이나 눌러야 합니다. 수업 맥락이 끊깁니다."',
    },
    {
      icon: <i className="fa-solid fa-triangle-exclamation"></i>,
      title: '잦은 오류와 렉',
      description: '"한참 열강 중에 렉이 걸리면 아이들 집중력이 깨지고 수업 흐름이 망가집니다."',
    },
  ];

  const faqData = {
    기능사용: [
      {
        q: '문제집을 폰으로 찍어서 칠판에 바로 띄울 수 있나요? (폰쉐어)',
        a: '네, \'Phone Share\' 기능을 통해 가능합니다. 학생이 틀린 문제를 스마트폰으로 찍어 전송하면, 전자칠판에 즉시 띄워 풀이할 수 있어 오답 노트 수업에 최적화되어 있습니다.',
      },
      {
        q: '아이패드나 맥북 연결도 잘 되나요?',
        a: '네, 완벽하게 호환됩니다. 유선(HDMI) 연결은 물론 E-share 앱을 통한 무선 미러링도 지원합니다. 아이패드 화면을 띄운 상태에서 판서도 가능합니다.',
      },
      {
        q: '인터넷 창과 판서 화면을 동시에 띄울 수 있나요?',
        a: '네, \'분할 화면(Multi-Window)\' 기능을 지원합니다. 화면을 반으로 나누어 한쪽엔 유튜브나 교재를, 다른 한쪽엔 칠판을 띄워 수업할 수 있습니다.',
      },
    ],
    설치배송: [
      {
        q: '3층인데 엘리베이터가 없습니다. 추가 비용 있나요? (중요)',
        a: '📢 이번 SMMT 공구 기간에만 \'무료\'입니다! 보통은 계단 운반비(양중비)나 사다리차 비용이 발생하지만, 이번 공구 신청자에 한해 본사가 전액 부담합니다. (단, 현장 상황 사전 고지 필요)',
        highlight: true,
      },
      {
        q: '기존에 쓰던 칠판 철거/수거도 해주시나요?',
        a: '기본적으로는 어렵지만, 상황에 따라 협의가 가능합니다. 상담 신청 폼의 \'문의사항\'에 기존 칠판 종류와 사이즈를 남겨주시면 해피콜 시 상세히 안내해 드리겠습니다.',
      },
      {
        q: '지방 학원도 설치 가능한가요?',
        a: '네, 전국(제주/도서산간 제외) 어디든 설치 가능합니다. SMMT 공동구매 혜택인 \'무료 배송/설치\'는 전국 동일하게 적용됩니다.',
      },
    ],
    결제지원: [
      {
        q: '렌탈로 하면 신용등급에 영향이 있나요?',
        a: '아니요, 영향이 없습니다. 넥소 렌탈은 금융 대출 상품이 아닌 B2B 렌탈 방식이므로 원장님의 개인 신용 점수와 무관하게 이용 가능합니다. (사업자등록증 필요)',
      },
      {
        q: '소상공인 국비 지원은 가능한가요?',
        a: '2025년도 소상공인 스마트상점 지원 사업은 마감되었습니다. 현재는 공동구매 혜택가가 가장 저렴하며, 내년도 사업 시행 시 넥소에서 빠르게 안내드릴 예정입니다.',
      },
    ],
  };

  const productSpecs = [
    {
      icon: <i className="fa-solid fa-eye"></i>,
      title: '눈부심 방지',
      spec: '무반사 강화유리 (Anti-Glare)',
      description: '형광등 아래서도 선명한 9H 경도 패널, 스크래치 방지',
    },
    {
      icon: <i className="fa-brands fa-apple"></i>,
      title: '기기 호환성',
      spec: '맥북, 아이패드, 갤럭시탭 완벽 호환',
      description: 'E-share 무선 미러링 지원 (양방향 제어 가능)',
    },
    {
      icon: <i className="fa-solid fa-microchip"></i>,
      title: '성능/용량',
      spec: 'Android 13 탑재 / 16GB RAM / 256GB 저장공간',
      description: '수업 자료를 칠판에 직접 저장해도 넉넉한 대용량',
    },
    {
      icon: <i className="fa-solid fa-video"></i>,
      title: '녹화/마이크',
      spec: '4K 카메라 + 8 어레이 마이크 내장',
      description: '별도 장비 없이 목소리와 판서 화면 동시 녹화 가능',
    },
    {
      icon: <i className="fa-solid fa-layer-group"></i>,
      title: '멀티태스킹',
      spec: '화면 분할 (Multi-Window) 지원',
      description: '좌측에 유튜브/교재 띄우고, 우측에 판서 가능',
    },
  ];

  const sizeOptions = [
    {
      size: '65',
      label: '소규모 강의실',
      color: 'gray',
      recommended: false,
      area: '8~10평 미만',
      students: '5~8명 내외',
      note: '교습소, 공부방, 1:1 과외방 추천',
    },
    {
      size: '75',
      label: '표준 강의실',
      color: 'orange',
      recommended: true,
      area: '10~15평',
      students: '10~15명',
      note: '가장 무난하고 실패 없는 선택',
      width: '가로길이 약 1.7m',
    },
    {
      size: '86',
      label: '대형 강의실',
      color: 'gray',
      recommended: false,
      area: '15평 이상',
      students: '20명 이상',
      note: '"거거익선" 후회 없는 선택',
      width: '가로길이 약 1.95m',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl text-deep-navy tracking-tighter">
              SMMT <span className="text-vibrant-orange">×</span> NEXO
            </span>
          </div>
          <div className="hidden md:block">
            <a
              href="#consult-form"
              className="bg-deep-navy text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition"
            >
              공동구매 신청하기
            </a>
          </div>
          <button
            className="md:hidden text-deep-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="fa-solid fa-bars text-xl"></i>
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4">
            <a
              href="#consult-form"
              className="block w-full bg-deep-navy text-white px-4 py-2 rounded-lg text-sm font-bold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              공동구매 신청하기
            </a>
          </div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* 배경 이미지 - 어두운 교실에서 전자칠판의 빛이 은은하게 퍼지는 이미지 */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1580894732444-8ecded7900cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block bg-vibrant-orange/20 text-vibrant-orange border border-vibrant-orange/50 px-3 py-1 rounded-full text-sm font-bold mb-6"
            >
              ⏳ 마감 임박: 4,000명 수학 원장님의 선택
            </motion.span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-loose mb-6">
              "수학 선생님,
              <br />
              아직도 전자칠판은
              <br />
              <span className="text-vibrant-orange underline decoration-4 underline-offset-4">
                '판서감'이 나빠서
              </span>
              <br />
              못 쓰겠다고 생각하십니까?"
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
              대한민국 수학 강사 커뮤니티 SMMT가 직접 검증하고 선택한 유일한 전자칠판.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.a
                href="#product-specs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-deep-navy px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-list-check text-vibrant-orange"></i> 제품 스펙 확인하기
              </motion.a>
              <motion.a
                href="#consult-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-vibrant-orange text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 transition relative"
                style={{
                  animation: 'pulse-animation 2s infinite',
                }}
              >
                공동구매 견적받기
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-deep-navy mb-4">
              왜 수학 선생님들은 전자칠판을 싫어했을까요?
            </h2>
            <p className="text-gray-500">우리는 여러분의 불신을 이해합니다. 기존 제품들은 수학 수업에 맞지 않았습니다.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300"
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 text-xl">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-deep-navy mb-2">{point.title}</h3>
                <p className="text-gray-600 text-sm">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analog vs Digital Comparison */}
      <section className="py-20 bg-slate-100 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-deep-navy">"분필 칠판이 제일 편하다"는 원장님께</h2>
            <p className="text-gray-500 mt-2">익숙함 때문에 수업의 효율을 포기하지 마세요. 비교해보면 확신이 듭니다.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-3 text-center border-b border-gray-200 bg-gray-50">
              <div className="p-4 font-bold text-gray-400">구분</div>
              <div className="p-4 font-bold text-gray-500">일반 분필 칠판</div>
              <div className="p-4 font-bold text-vibrant-orange bg-vibrant-orange/5">NEXO 전자칠판</div>
            </div>
            {[
              {
                label: '판서 공간',
                traditional: '지우고 다시 써야 함\n(수업 흐름 끊김)',
                nexo: '무한 판서 (Infinity Canvas)\n지우지 않고 확장 가능',
              },
              {
                label: '도형/그래프',
                traditional: '자/컴퍼스 필요\n그리는 데 시간 소요',
                nexo: '자동 보정 & 수식 그래프\n1초 만에 완성',
              },
              {
                label: '자료 공유',
                traditional: '판서 내용 휘발됨\n학생이 필기해야 함',
                nexo: 'QR 코드 즉시 공유\n필기 대신 수업에 집중',
              },
              {
                label: '건강/환경',
                traditional: '분필 가루 날림\n호흡기 걱정',
                nexo: '먼지 Zero, 눈부심 Zero\n쾌적한 강의실 환경',
              },
            ].map((row, index) => (
              <div key={index} className={`grid grid-cols-3 text-center border-b ${index === 3 ? '' : 'border-gray-100'} items-center`}>
                <div className="p-4 font-bold text-deep-navy text-sm">{row.label}</div>
                <div className="p-4 text-gray-500 text-sm whitespace-pre-line">{row.traditional}</div>
                <div className="p-4 text-deep-navy font-bold text-sm bg-vibrant-orange/5 whitespace-pre-line">
                  {row.nexo}
                  <br />
                  <span className="text-vibrant-orange text-xs">{index === 0 ? '지우지 않고 확장 가능' : index === 1 ? '1초 만에 완성' : index === 2 ? '필기 대신 수업에 집중' : '쾌적한 강의실 환경'}</span>
                </div>
              </div>
            ))}
          </motion.div>
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-deep-navy">
              아직도 망설여지시나요? <br className="md:hidden" />
              <span className="text-vibrant-orange font-bold">1시간 무료 방문 교육</span>으로 100% 적응시켜 드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* Product Specs */}
      <section id="product-specs" className="py-20 bg-white px-4 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest">PRODUCT SPECS</span>
            <h2 className="text-3xl font-bold text-deep-navy mt-2">
              선생님들이 가장 많이 묻는 기능,
              <br />
              표로 확인하세요
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            <table className="w-full">
              <tbody>
                {productSpecs.map((spec, index) => (
                  <tr key={index} className={index < productSpecs.length - 1 ? 'border-b border-gray-200' : ''}>
                    <th className="bg-light-gray text-deep-navy font-bold p-4 text-left w-[30%]">
                      <i className={`${spec.icon.props.className} text-vibrant-orange mr-2`}></i>
                      {spec.title}
                    </th>
                    <td className="p-4">
                      <span className="font-bold text-deep-navy block">{spec.spec}</span>
                      <span className="text-sm text-gray-500">{spec.description}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              <i className="fa-solid fa-check text-vibrant-orange mr-1"></i> 윈도우(PC) 판서 프로그램도 기본 제공됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section id="size-guide" className="py-20 bg-gray-50 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest">SIZE GUIDE</span>
            <h2 className="text-3xl font-bold text-deep-navy mt-2">"우리 학원엔 몇 인치가 맞을까요?"</h2>
            <p className="text-gray-500 mt-2">가장 많이 고민하시는 부분, 딱 정해드립니다.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {sizeOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`border rounded-2xl p-6 text-center relative bg-white ${
                  option.recommended
                    ? 'border-2 border-vibrant-orange shadow-xl md:-translate-y-4'
                    : 'border-gray-200 hover:border-vibrant-orange'
                } transition`}
              >
                {option.recommended && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-vibrant-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    BEST CHOICE
                  </div>
                )}
                <div className={`font-bold mb-2 ${option.recommended ? 'text-vibrant-orange' : 'text-gray-400'}`}>
                  {option.label}
                </div>
                <div className={`font-black text-deep-navy mb-4 ${option.recommended ? 'text-5xl' : 'text-4xl'}`}>
                  {option.size}
                  <span className="text-lg font-normal">인치</span>
                </div>
                <div
                  className={`rounded-lg p-4 mb-4 text-sm ${
                    option.recommended ? 'bg-vibrant-orange/5 text-gray-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <p className="mb-1">
                    <strong>추천 평수:</strong> {option.area}
                  </p>
                  <p>
                    <strong>수강 인원:</strong> {option.students}
                  </p>
                  {option.width && (
                    <p className="text-xs text-gray-500 mt-2">({option.width})</p>
                  )}
                </div>
                <p className={`text-xs ${option.recommended ? 'text-gray-500' : 'text-gray-400'}`}>
                  {option.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-center text-deep-navy mb-8"
          >
            궁금한 점, 여기서 해결하세요
          </motion.h2>

          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {['기능사용', '설치배송', '결제지원'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFAQTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                  activeFAQTab === tab
                    ? 'bg-deep-navy text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {faqData[activeFAQTab].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-sm border overflow-hidden ${
                  faq.highlight ? 'border-vibrant-orange' : 'border-gray-100'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors ${
                    faq.highlight ? 'bg-vibrant-orange/5' : ''
                  }`}
                >
                  <span className="font-bold text-deep-navy pr-4">{faq.q}</span>
                  <motion.i
                    animate={{ rotate: activeFAQ === index ? 180 : 0 }}
                    className="fa-solid fa-chevron-down text-gray-400 transition-transform"
                  />
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: activeFAQ === index ? 'auto' : 0,
                    opacity: activeFAQ === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`px-5 pb-5 text-gray-600 border-t ${
                      faq.highlight ? 'border-vibrant-orange/20 bg-vibrant-orange/5' : 'border-gray-100'
                    }`}
                  >
                    <p className="pt-4 whitespace-pre-line">{faq.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Pricing */}
      <section id="price-benefit" className="py-20 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest">LIMITED OFFER</span>
            <h2 className="text-3xl font-bold text-deep-navy mt-2">SMMT × NEXO 단독 혜택</h2>
            <p className="text-gray-500 mt-2">단 2주간, 오직 이 페이지에서만 가능한 조건입니다.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-vibrant-orange rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-vibrant-orange text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
              공동구매 한정
            </div>

            <div className="space-y-6">
              <ul className="space-y-4">
                {[
                  {
                    icon: <i className="fa-solid fa-check-circle"></i>,
                    title: '공동구매 특별 할인',
                    desc: '정가 대비 최대 OO% 할인 혜택',
                  },
                  {
                    icon: <i className="fa-solid fa-truck-fast"></i>,
                    title: '설치비 & 배송비 전액 무료',
                    desc: '지방, 계단 양중비(사다리차)까지 100% 지원',
                  },
                  {
                    icon: <i className="fa-solid fa-chalkboard-user"></i>,
                    title: '전문가 현장 방문 교육',
                    desc: '설치 당일 1시간, 마스터할 때까지 교육',
                  },
                  {
                    icon: <i className="fa-solid fa-video"></i>,
                    title: '[보너스] 이봉우 선생님 VOD',
                    desc: '전자칠판 200% 활용 수업 노하우 제공',
                  },
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-vibrant-orange mt-1">{benefit.icon}</span>
                    <div>
                      <strong className="block text-lg text-deep-navy">{benefit.title}</strong>
                      <span className="text-gray-500 text-sm">{benefit.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consult-form" className="py-20 bg-white px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-deep-navy mb-2">무료 시연 & 견적 신청</h2>
            <p className="text-gray-500">신청서를 남겨주시면 전문 상담원이 24시간 내에 해피콜을 드립니다.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-200"
            name="consultation"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleFormSubmit}
          >
            {/* Netlify Forms Hidden Fields */}
            <input type="hidden" name="form-name" value="consultation" />
            <input type="hidden" name="utm_source" value="smmt_gonggu" />
            <input type="hidden" name="utm_campaign" value="2026_q1_promo" />
            <input type="hidden" name="inquiry_date" value={new Date().toISOString().split('T')[0]} />
            {/* Honeypot field for spam protection */}
            <input type="hidden" name="bot-field" />

            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="customer_name">
                원장님 성함 <span className="text-vibrant-orange">*</span>
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                required
                placeholder="홍길동"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="org_name">
                학원명 (선택)
              </label>
              <input
                type="text"
                id="org_name"
                name="org_name"
                placeholder="써밋수학학원"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="phone_number">
                연락처 <span className="text-vibrant-orange">*</span>
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                required
                placeholder="010-0000-0000"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="region">
                지역 / 설치 환경 <span className="text-vibrant-orange">*</span>
              </label>
              <input
                type="text"
                id="region"
                name="region"
                required
                placeholder="예: 서울 강남 / 3층 (엘리베이터 없음)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="inquiry_type">
                문의 유형
              </label>
              <select
                id="inquiry_type"
                name="inquiry_type"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="quote">공동구매 견적 문의</option>
                <option value="size_consult">사이즈/설치 환경 상담</option>
                <option value="rental">렌탈/할부 프로그램 상담</option>
                <option value="demo">무료 시연(체험) 요청</option>
              </select>
            </div>

            {/* Privacy Policy Consent */}
            <div className="flex items-start gap-3 mt-4">
              <input
                type="checkbox"
                id="privacy-agree"
                name="privacy_agree"
                required
                className="mt-1 w-4 h-4 accent-vibrant-orange"
              />
              <label htmlFor="privacy-agree" className="text-xs text-gray-500 leading-tight cursor-pointer">
                [필수] 개인정보 수집 및 이용에 동의합니다. <br />
                (수집 항목: 성명, 연락처, 학원명 / 목적: 상담 및 견적 안내 / 보유 기간: 상담 종료 후 1년)
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-vibrant-orange text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-orange-600 transition mt-4"
            >
              공동구매 혜택받고 신청하기
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              * 상담 신청은 구매 확정이 아니며, 비용이 발생하지 않습니다.
            </p>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-navy text-gray-400 py-12 px-4 text-sm text-center">
        <div className="max-w-4xl mx-auto">
          <p className="mb-4 font-bold text-white text-lg">SMMT × NEXO</p>
          <p className="mb-2">(주)넥소 | 대표: 홍길동 | 사업자등록번호: 000-00-00000</p>
          <p className="mb-6">주소: 인천광역시 서구 로봇랜드로 123 넥소 R&D센터</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-white">
              이용약관
            </a>
            <a href="#" className="hover:text-white">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-white">
              고객센터
            </a>
          </div>
          <p className="mt-8 text-xs text-gray-600">Copyright © 2026 NEXO. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Action Button (Mobile) */}
      <motion.a
        href="#consult-form"
        className="fixed bottom-6 right-6 bg-vibrant-orange text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl z-50 md:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          animation: 'pulse-animation 2s infinite',
        }}
      >
        <i className="fa-solid fa-phone"></i>
      </motion.a>

      <style>{`
        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
          100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
