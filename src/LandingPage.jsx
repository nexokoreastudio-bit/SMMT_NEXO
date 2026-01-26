import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [activeFAQTab, setActiveFAQTab] = useState('기능사용');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMountType, setSelectedMountType] = useState('wall');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

  // 가격 정보 (이미지 기준)
  const priceData = {
    '65': { wall: 2250000, stand: 2500000 }, // 벽걸이 2,250,000원, 스탠드 +250,000원
    '75': { wall: 2750000, stand: 3000000 }, // 벽걸이 2,750,000원, 스탠드 +250,000원
    '86': { wall: 3450000, stand: 3800000 }, // 벽걸이 3,450,000원, 스탠드 +350,000원
  };
  
  // 정가 정보
  const regularPriceData = {
    '65': 2750000,
    '75': 3200000,
    '86': 4000000,
  };

  // 총 가격 계산
  const calculateTotalPrice = () => {
    if (!selectedSize || !selectedQuantity) return 0;
    const unitPrice = priceData[selectedSize]?.[selectedMountType] || 0;
    return unitPrice * parseInt(selectedQuantity);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 키보드 화살표로 섹션 간 이동 (웨비나 진행용)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const sections = document.querySelectorAll('section');
        const currentSection = Array.from(sections).find(
          (section) => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2;
          }
        );
        if (currentSection) {
          const currentIndex = Array.from(sections).indexOf(currentSection);
          if (currentIndex < sections.length - 1) {
            sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const sections = document.querySelectorAll('section');
        const currentSection = Array.from(sections).find(
          (section) => {
            const rect = section.getBoundingClientRect();
            return rect.top >= 0 && rect.top < window.innerHeight / 2;
          }
        );
        if (currentSection) {
          const currentIndex = Array.from(sections).indexOf(currentSection);
          if (currentIndex > 0) {
            sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const toggleCardFlip = (index) => {
    setFlippedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const agree = document.getElementById('privacy-agree');
    if (!agree.checked) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    
    // Netlify Forms 제출
    const form = e.target;
    const formData = new FormData(form);
    
    // form-name 필드 추가 (Netlify Forms 필수)
    formData.append('form-name', 'consultation');
    
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      
      if (response.ok) {
        alert('공동구매 주문이 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
        form.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const painPoints = [
    {
      icon: <i className="fa-solid fa-pen-nib"></i>,
      title: '미끄러운 판서감',
      description: '"분필 끝의 마찰력이 없어서 글씨가 날아갑니다. 정교한 수식 판서가 불가능합니다."',
      image: '/images/slippery-writing.png',
    },
    {
      icon: <i className="fa-solid fa-chart-line"></i>,
      title: '복잡한 그래프',
      description: '"함수 그래프 하나 그리는데 메뉴를 3번이나 눌러야 합니다. 수업 맥락이 끊깁니다."',
      image: '/images/complex-graph.png',
    },
    {
      icon: <i className="fa-solid fa-triangle-exclamation"></i>,
      title: '잦은 오류와 렉',
      description: '"한참 열강 중에 렉이 걸리면 아이들 집중력이 깨지고 수업 흐름이 망가집니다."',
      image: '/images/error-lag.png',
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
    ],
  };

  const productSpecs = [
    {
      icon: <i className="fa-solid fa-eye"></i>,
      title: '디스플레이',
      spec: 'Zero-Bonding & Anti-Glare / 완전 제로 반사 + 9H 경도 강화유리',
      description: '형광등 아래서도 선명한 시인성, 완벽한 필기감, 스크래치 방지',
    },
    {
      icon: <i className="fa-solid fa-video"></i>,
      title: '사운드 & 마이크 & 카메라',
      spec: '48MP AI Camera + 8 어레이 마이크 내장',
      description: '별도 장비 없이 목소리와 판서 화면 동시 녹화 가능',
    },
    {
      icon: <i className="fa-solid fa-microchip"></i>,
      title: '시스템 사양',
      spec: 'Android 13.0 (15.0 Up) / Octa-Core / 16GB / 256GB',
      description: '모든 과목(영어, 과학, 논술)을 완벽 지원하는 압도적 고사양 스펙',
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
    <div className="min-h-screen bg-gray-50 scroll-smooth" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '80px' }}>
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
              href="#google-form"
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
              href="#google-form"
              className="block w-full bg-deep-navy text-white px-4 py-2 rounded-lg text-sm font-bold text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              공동구매 신청하기
            </a>
          </div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 snap-start">
        {/* 비디오 배경 - 이봉우 선생님의 판서 영상 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
              src="https://www.youtube.com/embed/Ofl5GWPY2lQ?autoplay=1&loop=1&playlist=Ofl5GWPY2lQ&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{
                pointerEvents: 'none',
                minWidth: '100%',
                minHeight: '100%',
              }}
            />
          </div>
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-deep-navy/80 via-deep-navy/70 to-deep-navy/80"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 써밋 커뮤니티 회원 전용 특별 할인 배지 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-amber-600/90 text-white px-6 py-3 rounded-full text-sm md:text-base font-bold shadow-lg">
                <span className="text-xl">🎉</span>
                <span>써밋 커뮤니티 회원 전용 특별 할인</span>
              </div>
            </motion.div>

            {/* 메인 타이틀 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4"
            >
              K-AI 미래를 위한
              <br />
              <span className="text-vibrant-orange text-4xl md:text-6xl lg:text-7xl">
                NEXO SMART DISPLAY
              </span>
            </motion.h1>

            {/* 제품 설명 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-12"
            >
              <p className="text-gray-300 text-base md:text-lg mb-2">
                초고화질 4K UHDㆍ대화형 AI 탑재 · 50포인트 멀티터치
              </p>
              <p className="text-gray-400 text-sm md:text-base">
                학원 수업 환경의 새로운 표준을 제시합니다
              </p>
            </motion.div>

            {/* 할인 정보 박스 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 max-w-2xl mx-auto"
            >
              <p className="text-gray-400 text-sm md:text-base mb-3">써밋 회원 특별가</p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2">
                <span className="text-white text-sm md:text-base">정가 대비</span>
                <span className="text-vibrant-orange text-3xl md:text-4xl lg:text-5xl font-black">
                  최대 55만원 할인
                </span>
              </div>
            </motion.div>

            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="mt-10"
            >
              <motion.a
                href="#google-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-vibrant-orange text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-orange-600 transition relative inline-block"
                style={{
                  animation: 'pulse-animation 2s infinite',
                }}
              >
                공동구매 신청하기
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* NX-H Series 소개 섹션 */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-deep-navy/5 to-white px-4 snap-start">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block bg-vibrant-orange/20 text-vibrant-orange border border-vibrant-orange/50 px-4 py-2 rounded-full text-sm font-bold mb-6"
            >
              ⚡ 압도적 스펙, 수업의 격을 높이다
            </motion.span>
            <h2 className="text-3xl md:text-5xl font-black text-deep-navy leading-tight mb-6">
              NEXO NX-H Series,
              <br />
              <span className="text-vibrant-orange underline decoration-4 underline-offset-4">
                모든 과목을 아우르는 고사양 전자칠판
              </span>
              <br />
              <br />
              <span className="text-2xl md:text-4xl">
                수학, 영어, 과학, 논술까지 완벽 지원하는 압도적 스펙
              </span>
            </h2>
            <div className="mt-8 mb-6">
              <p className="text-deep-navy text-lg md:text-xl font-semibold mb-4">
                <strong className="text-vibrant-orange">Android 13.0 (15.0 Up)</strong> · <strong className="text-vibrant-orange">Octa-Core</strong> · <strong className="text-vibrant-orange">16GB / 256GB</strong> · <strong className="text-vibrant-orange">Zero-Bonding</strong>
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                수학뿐만 아니라 모든 과목을 위한 <strong className="text-deep-navy">All-Rounder</strong> 고사양 스펙
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="pt-24 pb-20 bg-white px-4 snap-start hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-deep-navy mb-4 scroll-mt-24">
              왜 원장님들은 전자칠판을 싫어했을까요?
            </h2>
            <p className="text-gray-500">우리는 여러분의 불신을 이해합니다. 기존 제품들은 모든 과목 수업에 맞지 않았습니다.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {painPoints.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative h-64 cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => toggleCardFlip(index)}
              >
                <motion.div
                  animate={{ rotateY: flippedCards[index] ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* 앞면 (카드) */}
                  <div
                    className="absolute inset-0 bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition duration-300 backface-hidden"
                    style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500 text-xl">
                      {point.icon}
                    </div>
                    <h3 className="text-xl font-bold text-deep-navy mb-2">{point.title}</h3>
                    <p className="text-gray-600 text-sm">{point.description}</p>
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                      <i className="fa-solid fa-hand-pointer mr-1"></i> 클릭하여 확인
                    </div>
                  </div>

                  {/* 뒷면 (이미지) */}
                  <div
                    className="absolute inset-0 bg-white rounded-2xl border-2 border-vibrant-orange overflow-hidden backface-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <img
                      src={point.image}
                      alt={point.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                      <div className="p-4 text-white">
                        <h4 className="font-bold text-lg mb-1">{point.title}</h4>
                        <p className="text-sm text-gray-200">문제 상황 예시</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 text-white/80">
                      <i className="fa-solid fa-rotate-left"></i>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Analog vs Digital Comparison */}
      <section className="pt-24 pb-20 bg-slate-100 px-4 snap-start hidden">
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

      {/* Tech Showcase - 기능 시연 */}
      <section className="pt-24 pb-20 bg-white px-4 snap-start">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">TECH SHOWCASE</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mt-3">
              압도적 스펙으로 모든 과목을 완벽 지원
            </h2>
            <p className="text-gray-600 mt-3">수학, 영어, 과학, 논술까지 모든 수업 환경을 아우르는 NX-H Series</p>
          </motion.div>

          {/* 기능 1: 인피니티 캔버스 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 items-center mb-20"
          >
            <div className="order-2 md:order-1">
              <div className="bg-gray-100 rounded-2xl p-4 aspect-video overflow-hidden">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/nKYE16PydzQ?autoplay=1&loop=1&playlist=nKYE16PydzQ&mute=1&controls=1&modestbranding=1&rel=0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="무한 판서 데모"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-5xl mb-4">📜</div>
              <h3 className="text-2xl md:text-3xl font-bold text-deep-navy mb-4">
                인피니티 캔버스
                <br />
                <span className="text-vibrant-orange">(무한 판서)</span>
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                지우지 마세요. 위로 밀어 올리세요.
                <br />
                긴 풀이 과정도 끊김 없이 이어집니다.
              </p>
            </div>
          </motion.div>

          {/* 기능 2: 1초 그래프 변환 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 items-center mb-20"
          >
            <div>
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl md:text-3xl font-bold text-deep-navy mb-4">
                1초 그래프 변환
                <br />
                <span className="text-vibrant-orange">유마인드 AI</span>
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                도형과 함수 그래프, 1초면 충분합니다.
                <br />
                넥소만의 '유마인드' 소프트웨어가 수학 수업을 보조합니다.
              </p>
            </div>
            <div>
              <div className="bg-gray-100 rounded-2xl p-4 aspect-video overflow-hidden">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/Ofl5GWPY2lQ?autoplay=1&loop=1&playlist=Ofl5GWPY2lQ&mute=1&controls=1&modestbranding=1&rel=0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="그래프 변환 데모"
                />
              </div>
            </div>
          </motion.div>

          {/* 기능 3: 수업 녹화 및 QR 공유 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="order-2 md:order-1">
              <div className="bg-gray-100 rounded-2xl p-4 aspect-video overflow-hidden">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/Ci1uy-5eEJg?autoplay=1&loop=1&playlist=Ci1uy-5eEJg&mute=1&controls=1&modestbranding=1&rel=0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="녹화 및 QR 공유"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="text-5xl mb-4">📹</div>
              <h3 className="text-2xl md:text-3xl font-bold text-deep-navy mb-4">
                수업 녹화 및 QR 공유
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                별도 장비 없이 수업 자동 녹화.
                <br />
                결석생에게 QR코드로 즉시 공유하세요.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why NEXO - 핵심 기능 강조 */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-deep-navy to-slate-900 px-4 snap-start">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">WHY NEXO</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
              왜 NEXO인가요?
            </h2>
            <p className="text-gray-300 text-lg">
              AI 디지털 환경을 위한 NEXO 전자칠판은 교육 환경의 새로운 표준을 제시합니다.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <i className="fa-solid fa-microchip"></i>,
                title: 'NX-H Series 독점 사양',
                description: 'Android 13.0 (15.0 Up), Octa-Core, 16GB / 256GB 등 고사양 스펙 부각',
              },
              {
                icon: <i className="fa-solid fa-eye"></i>,
                title: 'Zero-Bonding & Anti-Glare',
                description: '완전 제로 반사, 고강도 강화유리의 시인성 및 필기감',
              },
              {
                icon: <i className="fa-solid fa-wifi"></i>,
                title: 'Smart Connectivity',
                description: '실시간 무선 화면 미러링 (양방향 제어 지원)',
              },
              {
                icon: <i className="fa-solid fa-layer-group"></i>,
                title: 'Usability',
                description: '간편한 QR코드 생성/공유, 멀티태스킹 분할 화면',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-vibrant-orange/20 flex items-center justify-center text-vibrant-orange text-2xl">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Specs */}
      <section id="product-specs" className="pt-24 pb-20 bg-light-gray px-4 scroll-mt-24 snap-start">
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
              NX-H Series 압도적 스펙,
              <br />
              모든 과목을 완벽 지원
            </h2>
            <p className="text-gray-500 mt-2">수학, 영어, 과학, 논술까지 모든 수업 환경에 최적화</p>
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
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600 text-sm">
              <i className="fa-solid fa-check text-vibrant-orange mr-1"></i> 윈도우(PC) 판서 프로그램도 기본 제공됩니다.
            </p>
            <p className="text-vibrant-orange font-bold text-sm">
              <i className="fa-solid fa-star mr-1"></i> NX-H Series 독점 사양: Android 13.0 (15.0 Up), Octa-Core, 16GB / 256GB로 모든 과목 완벽 지원
            </p>
          </div>
        </div>
      </section>

      {/* 제품 라인업 */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-slate-800 to-slate-900 px-4 snap-start">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">제품 라인업</h2>
            <p className="text-gray-300 text-lg">학원 규모와 용도에 맞는 최적의 모델을 선택하세요</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                size: '65"',
                label: '65인치',
                recommended: false,
                specs: {
                  cpu: 'Octa-Core',
                  os: 'Android 13.0 (15.0 Up)',
                  memory: '16GB / 256GB',
                  brightness: '450nits',
                  audio: '20W x 2 + Subwoofer',
                  connectivity: 'Wi-Fi 6, NFC, 대화형 AI, 지문인식',
                },
              },
              {
                size: '75"',
                label: '75인치',
                recommended: true,
                specs: {
                  cpu: 'Octa-Core',
                  os: 'Android 13.0 (15.0 Up)',
                  memory: '16GB / 256GB',
                  brightness: '450nits',
                  audio: '20W x 2 + Subwoofer',
                  connectivity: 'Wi-Fi 6, NFC, 대화형 AI, 지문인식',
                },
              },
              {
                size: '86"',
                label: '86인치',
                recommended: false,
                specs: {
                  cpu: 'Octa-Core',
                  os: 'Android 13.0 (15.0 Up)',
                  memory: '16GB / 256GB',
                  brightness: '450nits',
                  audio: '20W x 2 + Subwoofer',
                  connectivity: 'Wi-Fi 6, NFC, 대화형 AI, 지문인식',
                },
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 ${
                  product.recommended
                    ? 'border-vibrant-orange shadow-2xl md:-translate-y-2'
                    : 'border-gray-700 hover:border-gray-600'
                } transition-all duration-300`}
              >
                {product.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-vibrant-orange text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    학원 추천
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">NX-H Series</h3>
                  <p className="text-gray-400 text-sm mb-4">{product.label}</p>
                  <div className="text-4xl md:text-5xl font-black text-vibrant-orange">{product.size}</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-vibrant-orange mt-1 flex-shrink-0"></i>
                    <div className="text-sm">
                      <span className="text-gray-400">CPU:</span>
                      <span className="text-white ml-2">{product.specs.cpu}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-vibrant-orange mt-1 flex-shrink-0"></i>
                    <div className="text-sm">
                      <span className="text-gray-400">OS:</span>
                      <span className="text-white ml-2">{product.specs.os}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-vibrant-orange mt-1 flex-shrink-0"></i>
                    <div className="text-sm">
                      <span className="text-gray-400">Memory/Storage:</span>
                      <span className="text-white ml-2">{product.specs.memory}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-vibrant-orange mt-1 flex-shrink-0"></i>
                    <div className="text-sm">
                      <span className="text-gray-400">Brightness:</span>
                      <span className="text-white ml-2">{product.specs.brightness}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-vibrant-orange mt-1 flex-shrink-0"></i>
                    <div className="text-sm">
                      <span className="text-gray-400">Audio:</span>
                      <span className="text-white ml-2">{product.specs.audio}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <i className="fa-solid fa-check text-vibrant-orange mt-1 flex-shrink-0"></i>
                    <div className="text-sm">
                      <span className="text-gray-400">Connectivity:</span>
                      <span className="text-white ml-2">{product.specs.connectivity}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-gray-400 text-xs mb-2">공통 기능</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>• 4K UHD</div>
                    <div>• 50포인트 터치</div>
                    <div>• 48MP AI Camera</div>
                    <div>• 8개 마이크</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Guide */}
      <section id="size-guide" className="pt-24 pb-20 bg-gray-50 px-4 scroll-mt-24 snap-start">
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

          {/* 칠판 이미지 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <img
              src="/images/whiteboard-size.jpg"
              alt="전자칠판 사이즈 비교"
              className="mx-auto rounded-2xl shadow-lg max-w-full h-auto"
              style={{ maxHeight: '500px' }}
            />
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

      {/* 학원 수업의 새로운 기준 - NEXO 교육 솔루션 */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 snap-start">
        <div className="max-w-7xl mx-auto">
          {/* 상단 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-vibrant-orange mb-6">
              학원 수업의 새로운 기준
            </h2>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              NEXO 스마트 디스플레이는 전국 학원 납품 1위를 기록하며, 수많은 학원에서 검증된 교육 솔루션입니다.
            </p>
          </motion.div>

          {/* 4가지 핵심 기능 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: <i className="fa-solid fa-chalkboard-teacher"></i>,
                title: '학원 수업',
                description: '펜, 도형, 지우개, 수학/과학 도구로 직관적인 수업 진행',
              },
              {
                icon: <i className="fa-solid fa-video"></i>,
                title: '온라인 강의',
                description: '무반사 화면으로 빛 반사 없이 선명한 강의 녹화',
              },
              {
                icon: <i className="fa-solid fa-mobile-screen-button"></i>,
                title: '학생 미러링',
                description: '16개 디바이스 동시 연결로 학생 발표 및 참여 유도',
              },
              {
                icon: <i className="fa-solid fa-robot"></i>,
                title: 'AI 학습 지원',
                description: '실시간 Q&A, 수학 풀이, 외국어 학습 AI 지원',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-vibrant-orange/50 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-vibrant-orange/20 flex items-center justify-center text-vibrant-orange text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* 하단 섹션 - NEXO NX-Series 상세 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gray-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/50"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* 텍스트 영역 */}
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  수업, 화상회의, 발표, 행사 등 모든 업무에 활용 가능한 NEXO NX-Series
                </h3>
                <ul className="space-y-4">
                  {[
                    '초고화질 4K UHD Display',
                    '무반사(최상위등급)적용·경도9H 고강도 강화유리',
                    '무선 양방향 9개 디바이스 동시 미러링',
                    '대화형 AI기능 탑재',
                    '빠른 응답속도',
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <i className="fa-solid fa-check-circle text-vibrant-orange mt-1 flex-shrink-0"></i>
                      <span className="text-gray-300 text-base md:text-lg">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* 제품 이미지 영역 */}
              <div className="relative">
                <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700/50">
                  <div className="aspect-video bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-red-900/20 rounded-xl flex items-center justify-center relative overflow-hidden">
                    {/* 제품 UI 시뮬레이션 */}
                    <div className="absolute inset-0 flex flex-col">
                      {/* 상단 상태바 */}
                      <div className="h-12 bg-gray-900/50 flex items-center justify-between px-4 text-white text-xs">
                        <div className="flex items-center gap-2">
                          <span>11:45</span>
                          <span className="text-gray-400">5월 8일</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="fa-solid fa-wifi"></i>
                          <i className="fa-solid fa-battery-full"></i>
                        </div>
                      </div>
                      {/* 중앙 검색바 */}
                      <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 w-3/4 flex items-center gap-3">
                          <i className="fa-brands fa-google text-white/60"></i>
                          <span className="text-white/60 text-sm">검색</span>
                        </div>
                      </div>
                      {/* 하단 앱 아이콘 */}
                      <div className="h-20 bg-gray-900/50 flex items-center justify-center gap-6 px-8">
                        <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                          <i className="fa-brands fa-chrome text-blue-400"></i>
                        </div>
                        <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center">
                          <i className="fa-brands fa-youtube text-red-400"></i>
                        </div>
                        <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                          <i className="fa-solid fa-file-word text-green-400"></i>
                        </div>
                        <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                          <i className="fa-brands fa-google-play text-purple-400"></i>
                        </div>
                        <div className="w-16 h-16 bg-vibrant-orange/20 rounded-xl flex items-center justify-center">
                          <span className="text-vibrant-orange font-bold text-xs">NEXO</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Specifications - 상세 제품 사양 */}
      <section id="product-specs" className="pt-24 pb-20 bg-white px-4 snap-start">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">PRODUCT SPECIFICATIONS</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mt-3 mb-3">넥소 NX-H 시리즈 상세 사양</h2>
            <p className="text-gray-600 text-base">65인치, 75인치, 86인치 공통 사양</p>
          </motion.div>

          {/* 디스플레이 사양 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-deep-navy mb-4 flex items-center gap-2">
              <i className="fa-solid fa-tv text-vibrant-orange"></i>
              디스플레이 (Display)
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-deep-navy">베젤 색상:</strong> <span className="text-gray-700">알루미늄 프레임 (화이트)</span></div>
                <div><strong className="text-deep-navy">패널 유형:</strong> <span className="text-gray-700">Ultra HD Direct-type LED</span></div>
                <div><strong className="text-deep-navy">해상도:</strong> <span className="text-gray-700">3840×2160 / 60Hz</span></div>
                <div><strong className="text-deep-navy">픽셀 피치:</strong> <span className="text-gray-700">0.372mm × 0.372mm</span></div>
                <div><strong className="text-deep-navy">경도 유리:</strong> <span className="text-gray-700">Mohs-9 level</span></div>
                <div><strong className="text-deep-navy">유리 패널:</strong> <span className="text-gray-700">Anti-glare glass (무반사 강화유리)</span></div>
                <div><strong className="text-deep-navy">종횡비:</strong> <span className="text-gray-700">16:09</span></div>
                <div><strong className="text-deep-navy">대비 비율:</strong> <span className="text-gray-700">1200:1 (typical)</span></div>
                <div><strong className="text-deep-navy">밝기:</strong> <span className="text-gray-700">450cd/m²</span></div>
                <div><strong className="text-deep-navy">색상 깊이:</strong> <span className="text-gray-700">10.7억 색상</span></div>
                <div><strong className="text-deep-navy">시야각:</strong> <span className="text-gray-700">178°</span></div>
                <div><strong className="text-deep-navy">수명:</strong> <span className="text-gray-700">50,000시간</span></div>
              </div>
            </div>
          </motion.div>

          {/* 사운드 & 마이크 & 카메라 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-deep-navy mb-4 flex items-center gap-2">
              <i className="fa-solid fa-volume-high text-vibrant-orange"></i>
              사운드 & 마이크 & 카메라
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-deep-navy mb-3">사운드</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>프론트 스피커:</strong> <span className="text-gray-700">20W × 2</span></div>
                    <div><strong>서브우퍼:</strong> <span className="text-gray-700">Subwoofer</span></div>
                    <div><strong>총 출력:</strong> <span className="text-gray-700">≤60W</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-deep-navy mb-3">마이크 (옵션)</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>유형:</strong> <span className="text-gray-700">광역 마이크</span></div>
                    <div><strong>개수:</strong> <span className="text-gray-700">8개</span></div>
                    <div><strong>자동 스위치:</strong> <span className="text-gray-700">지원</span></div>
                    <div><strong>분리 가능:</strong> <span className="text-gray-700">지원</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-deep-navy mb-3">카메라 (옵션)</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>해상도:</strong> <span className="text-gray-700">48MP AI Camera</span></div>
                    <div><strong>최대 해상도:</strong> <span className="text-gray-700">4208×3120 (30fps)</span></div>
                    <div><strong>시야각:</strong> <span className="text-gray-700">120°</span></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 시스템 사양 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-deep-navy mb-4 flex items-center gap-2">
              <i className="fa-solid fa-microchip text-vibrant-orange"></i>
              시스템 사양 (Riotouch Central)
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div><strong className="text-deep-navy">칩셋:</strong> <span className="text-gray-700">Rockchip RK3588</span></div>
                <div><strong className="text-deep-navy">CPU:</strong> <span className="text-gray-700">Octa-Core</span></div>
                <div><strong className="text-deep-navy">GPU:</strong> <span className="text-gray-700">Mali-G610 MC4</span></div>
                <div><strong className="text-deep-navy">RAM:</strong> <span className="text-gray-700">16GB DDR4</span></div>
                <div><strong className="text-deep-navy">저장공간:</strong> <span className="text-gray-700">256GB Flash</span></div>
                <div><strong className="text-deep-navy">안드로이드 버전:</strong> <span className="text-gray-700">Android 13.0 (15.0 Up)</span></div>
                <div><strong className="text-deep-navy">Wi-Fi:</strong> <span className="text-gray-700">IEEE 802.11a/b/g/n/ac/ax (Wi-Fi 6), 2.4/5GHz</span></div>
                <div><strong className="text-deep-navy">블루투스:</strong> <span className="text-gray-700">5.2</span></div>
                <div><strong className="text-deep-navy">Windows OPS 슬롯:</strong> <span className="text-gray-700">80핀 OPS 슬롯</span></div>
                <div><strong className="text-deep-navy">지원 OS:</strong> <span className="text-gray-700">Windows, Mac, Linux, Chrome OS</span></div>
                <div><strong className="text-deep-navy">OTA 업데이트:</strong> <span className="text-gray-700">지원</span></div>
                <div><strong className="text-deep-navy">센서:</strong> <span className="text-gray-700">광 센서, 온도/습도/공기질 3-in-One, NFC 리더/라이터, 지문 모듈</span></div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Pricing Table - 가격표 */}
      <section id="pricing-table" className="pt-24 pb-20 bg-light-gray px-4 snap-start">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">PRICING</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mt-3 mb-3">써밋 회원 전용 특별가 (1/27~2/18)</h2>
            <p className="text-gray-600 text-base mb-4">
              써밋 커뮤니티 회원만을 위한 특별 할인가로 NEXO 전자칠판을 만나보세요.
              <br />
              지금 문의하시면 상담부터 설치까지 전담 지원해 드립니다.
            </p>
            <div className="mt-4">
              <p className="text-lg font-bold text-deep-navy mb-2">써밋 × NEXO 콜라보 특가</p>
              <p className="text-2xl md:text-3xl font-black text-vibrant-orange">최대 55만원 할인</p>
            </div>
          </motion.div>

          {/* 가격표 - 65인치, 75인치, 86인치 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 pt-4">
            {[
              {
                size: '65',
                label: '65인치',
                regularPrice: 2750000,
                discount: 500000,
                prices: {
                  cash: { wall: 2250000, stand: 2500000 },
                  installment: {
                    '24': { wall: 117700, stand: 129800 },
                    '36': { wall: 82500, stand: 92400 },
                    '48': { wall: 67100, stand: 74800 },
                    '60': { wall: 58300, stand: 64900 },
                  },
                },
              },
              {
                size: '75',
                label: '75인치',
                recommended: true,
                regularPrice: 3200000,
                discount: 450000,
                prices: {
                  cash: { wall: 2750000, stand: 3000000 },
                  installment: {
                    '24': { wall: 143000, stand: 156200 },
                    '36': { wall: 101200, stand: 110000 },
                    '48': { wall: 82500, stand: 89100 },
                    '60': { wall: 71500, stand: 77000 },
                  },
                },
              },
              {
                size: '86',
                label: '86인치',
                regularPrice: 4000000,
                discount: 550000,
                prices: {
                  cash: { wall: 3450000, stand: 3800000 },
                  installment: {
                    '24': { wall: 179300, stand: 198000 },
                    '36': { wall: 126500, stand: 139700 },
                    '48': { wall: 102300, stand: 113300 },
                    '60': { wall: 89100, stand: 97900 },
                  },
                },
              },
            ].map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg border-2 relative ${
                  product.recommended ? 'border-vibrant-orange md:-translate-y-4' : 'border-gray-200'
                }`}
              >
                {product.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-vibrant-orange text-white text-xs font-bold px-4 py-1 rounded-full z-10 whitespace-nowrap">
                    BEST CHOICE
                  </div>
                )}
                <div className="p-6 pt-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-black text-deep-navy mb-2">{product.label}</h3>
                    <p className="text-gray-500 text-sm">전자칠판</p>
                    {product.regularPrice && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 line-through">일반가 {product.regularPrice.toLocaleString()}원</p>
                        <p className="text-xs text-vibrant-orange font-bold mt-1">
                          → 공구가 {product.prices.cash.wall.toLocaleString()}원
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 현금/카드 결제 */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="text-sm font-bold text-deep-navy mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-money-bill-wave text-vibrant-orange"></i>
                      현금 or 신용카드
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">벽걸이</span>
                        <span className="font-bold text-deep-navy">
                          {product.prices.cash.wall.toLocaleString()}원
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">전용 이동형 스탠드</span>
                        <span className="font-bold text-deep-navy">
                          {product.prices.cash.stand.toLocaleString()}원
                        </span>
                      </div>
                      {product.discount && (
                        <div className="mt-3 pt-3 border-t-2 border-vibrant-orange/30">
                          <div className="bg-vibrant-orange/10 rounded-lg p-3 text-center">
                            <p className="text-lg md:text-xl font-black text-vibrant-orange">
                              {product.discount.toLocaleString()}원 할인
                            </p>
                            <p className="text-xs text-gray-600 mt-1">정가 대비 특별 할인</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 할부 결제 */}
                  <div>
                    <h4 className="text-sm font-bold text-deep-navy mb-3 flex items-center gap-2">
                      <i className="fa-solid fa-credit-card text-vibrant-orange"></i>
                      금융사 할부 (월 납입금)
                    </h4>
                    <div className="space-y-3">
                      {['24', '36', '48', '60'].map((months) => (
                        <div key={months} className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs font-bold text-vibrant-orange mb-2">
                            {months}개월
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">벽걸이</span>
                              <span className="font-bold text-deep-navy">
                                {product.prices.installment[months].wall.toLocaleString()}원
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">이동형 스탠드</span>
                              <span className="font-bold text-deep-navy">
                                {product.prices.installment[months].stand.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 포함 서비스 및 안내 사항 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <h4 className="font-bold text-deep-navy mb-4 text-center">포함 서비스</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <i className="fa-solid fa-check-circle text-vibrant-orange"></i>
                <span className="text-gray-700">무료 설치 및 교육</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="fa-solid fa-check-circle text-vibrant-orange"></i>
                <span className="text-gray-700">1년 무상 A/S</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <i className="fa-solid fa-check-circle text-vibrant-orange"></i>
                <span className="text-gray-700">이동형 스탠드 옵션</span>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 text-center">
                *벽면 설치 시, 스탠드 비용 제외
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof - 이봉우 대표 추천사 */}
      <section className="pt-24 pb-20 bg-deep-navy px-4 snap-start">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center text-4xl">
                <i className="fa-solid fa-quote-left text-vibrant-orange"></i>
              </div>
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-relaxed mb-6">
                "직접 써보지 않은 제품은 추천하지 않습니다. 넥소는 제가 연구실에서 매일 테스트하며 수업에 활용하고 있는 제품입니다."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <i className="fa-solid fa-user text-white text-xl"></i>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-lg">SMMT 대표</p>
                  <p className="text-vibrant-orange font-semibold">이봉우 (봉샘)</p>
                </div>
              </div>
            </div>

            {/* 커뮤니티 댓글 캡처 슬라이더 */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  name: '원장님 1',
                  review: '"기존 전자칠판과는 차원이 달라요. 판서감이 정말 자연스럽고, 함수 그래프도 한 번에 그려집니다. 학생들 반응도 좋고요!"',
                },
                {
                  name: '원장님 2',
                  review: '"무한 판서 기능이 최고예요. 긴 풀이 과정도 끊김 없이 이어갈 수 있어서 수업 효율이 엄청나게 올라갔습니다."',
                },
                {
                  name: '원장님 3',
                  review: '"QR코드로 수업 내용을 바로 공유할 수 있어서 결석생 관리가 훨씬 쉬워졌어요. 설치 후 한 달 만에 학원생이 20% 늘었습니다!"',
                },
              ].map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-vibrant-orange/20 flex items-center justify-center">
                      <i className="fa-solid fa-user text-vibrant-orange"></i>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{review.name}</p>
                      <p className="text-gray-400 text-xs">SMMT 회원</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {review.review}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pt-24 pb-20 bg-white px-4 snap-start">
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
      <section id="price-benefit" className="pt-12 pb-20 bg-white px-4 snap-start">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">LIMITED OFFER</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mt-3 mb-3">SMMT 런칭 기념, 단 2주간의 혜택</h2>
            <p className="text-gray-600 text-base">(1월 27일 화요일 ~ 2월 18일 수요일 마감)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-vibrant-orange rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-vibrant-orange text-white text-xs font-bold px-4 py-2 rounded-bl-2xl">
              공동구매 한정
            </div>

            <div className="mt-2">
              <ul className="space-y-6">
                {[
                  {
                    icon: <i className="fa-solid fa-check-circle text-xl"></i>,
                    title: '공동구매 특별가',
                    desc: '',
                  },
                  {
                    icon: <i className="fa-solid fa-truck-fast text-xl"></i>,
                    title: '설치비 및 배송비 무료',
                    desc: '지방, 계단 양중비(사다리차)까지 100% 지원',
                  },
                  {
                    icon: <i className="fa-solid fa-credit-card text-xl"></i>,
                    title: '최대 60개월 무이자 할부 지원',
                    desc: '',
                  },
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-vibrant-orange/10 flex items-center justify-center text-vibrant-orange">
                      {benefit.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <strong className="block text-lg md:text-xl font-bold text-deep-navy mb-1.5">
                        {benefit.title}
                      </strong>
                      {benefit.desc && (
                        <span className="text-gray-600 text-sm md:text-base leading-relaxed block">
                          {benefit.desc}
                        </span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Form */}
      <section id="consult-form" className="pt-24 pb-20 bg-white px-4 snap-start">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-deep-navy mb-2">공동구매 주문</h2>
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
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="size">
                인치 종류 <span className="text-vibrant-orange">*</span>
              </label>
              <select
                id="size"
                name="size"
                required
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="">인치를 선택해주세요</option>
                <option value="65">65인치</option>
                <option value="75">75인치</option>
                <option value="86">86인치</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="mount_type">
                설치 방식 <span className="text-vibrant-orange">*</span>
              </label>
              <select
                id="mount_type"
                name="mount_type"
                required
                value={selectedMountType}
                onChange={(e) => setSelectedMountType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="wall">벽걸이</option>
                <option value="stand">이동형 스탠드</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-deep-navy mb-1" htmlFor="quantity">
                구매 수량 <span className="text-vibrant-orange">*</span>
              </label>
              <select
                id="quantity"
                name="quantity"
                required
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="">수량을 선택해주세요</option>
                <option value="1">1대</option>
                <option value="2">2대</option>
                <option value="3">3대</option>
                <option value="4">4대</option>
                <option value="5">5대</option>
                <option value="6">6대</option>
                <option value="7">7대</option>
                <option value="8">8대</option>
                <option value="9">9대</option>
                <option value="10">10대</option>
              </select>
            </div>

            {/* 가격 표시 */}
            {selectedSize && selectedQuantity && (
              <div className="bg-vibrant-orange/10 border-2 border-vibrant-orange rounded-xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-deep-navy">단가:</span>
                  <span className="text-lg font-bold text-deep-navy">
                    {priceData[selectedSize]?.[selectedMountType]?.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-deep-navy">수량:</span>
                  <span className="text-lg font-bold text-deep-navy">{selectedQuantity}대</span>
                </div>
                <div className="border-t border-vibrant-orange/30 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-deep-navy">총 주문 금액:</span>
                    <span className="text-2xl font-black text-vibrant-orange">
                      {calculateTotalPrice().toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            )}

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
              주문하기
            </button>
            <p className="text-xs text-center text-gray-400 mt-2">
              * 상담 신청은 구매 확정이 아니며, 비용이 발생하지 않습니다.
            </p>
          </motion.form>
        </div>
      </section>

      {/* Webinar & Live Broadcast Section */}
      <section className="relative pt-24 pb-20 px-4 snap-start overflow-hidden">
        {/* 비디오 배경 - 영상회의/웨비나 장면 */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop"
          >
            {/* public/videos/webinar-background.mp4 파일을 업로드하세요 */}
            <source src="/videos/webinar-background.mp4" type="video/mp4" />
            {/* 폴백 이미지 */}
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.85), rgba(0, 51, 102, 0.9)), url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop')`,
              }}
            />
          </video>
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-br from-deep-navy/85 via-deep-navy/80 to-deep-navy/85"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase mb-4 inline-block">
              LIVE BROADCAST
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
              라이브 방송에서만 공개되는 특별 혜택
            </h2>
            <p className="text-gray-300 text-lg">
              웨비나를 통해 넥소 전자칠판의 모든 것을 직접 확인하세요
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* 웨비나 일정 안내 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-white mb-4">웨비나 일정</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                라이브 방송 일정이 확정되는 대로 공지해드립니다.
                <br />
                <span className="text-vibrant-orange font-semibold">곧 공개 예정</span>이니 많은 관심 부탁드립니다!
              </p>
              <div className="bg-vibrant-orange/20 border border-vibrant-orange/50 rounded-lg p-4">
                <p className="text-white font-semibold text-sm">
                  <i className="fa-solid fa-bell text-vibrant-orange mr-2"></i>
                  알림 신청하시면 일정 확정 시 가장 먼저 알려드립니다
                </p>
              </div>
            </motion.div>

            {/* 라이브 방송 혜택 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold text-white mb-4">라이브 방송 특별 혜택</h3>
              <ul className="space-y-3">
                {[
                  '라이브 방송중 신청시 스타벅스 쿠폰 5만원권 지급',
                  '실시간 Q&A로 궁금증 해결',
                  '생생한 판서 영상 직접 확인',
                  '한정 수량 특가 상품 선착순 제공',
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <i className="fa-solid fa-check-circle text-vibrant-orange mt-1"></i>
                    <span className="text-gray-200">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* 웨비나 신청 CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <a
              href="#consult-form"
              className="inline-block bg-vibrant-orange text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-orange-600 transition transform hover:scale-105"
            >
              웨비나 입장하기
            </a>
          </motion.div>
        </div>
      </section>

      {/* Google Form - 실제 신청 섹션 */}
      <section id="google-form" className="pt-24 pb-20 bg-light-gray px-4 snap-start">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-vibrant-orange font-bold text-sm tracking-widest uppercase">OFFICIAL APPLICATION</span>
            <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mt-3 mb-4">
              공동구매 공식 신청
            </h2>
            <p className="text-gray-600 text-lg">
              상담을 통해 확정된 원장님께서는 아래 구글 폼을 통해 공식 신청해주세요
            </p>
            <p className="text-sm text-gray-500 mt-2">
              문의: <a href="mailto:nexo.korea.studio@gmail.com" className="text-vibrant-orange hover:underline">nexo.korea.studio@gmail.com</a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-vibrant-orange"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-deep-navy mb-2">
                구글 폼으로 신청하기
              </h3>
              <p className="text-gray-600">
                아래 버튼을 클릭하시면 공동구매 공식 신청 폼으로 이동합니다
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-600 mb-4">
                <strong className="text-deep-navy">신청 전 확인사항:</strong>
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-vibrant-orange mt-1"></i>
                  <span>상담을 통해 사이즈 및 옵션이 확정된 경우에만 신청해주세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-vibrant-orange mt-1"></i>
                  <span>신청 후 담당자가 최종 확인 연락을 드립니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-vibrant-orange mt-1"></i>
                  <span>문의사항은 nexo.korea.studio@gmail.com으로 연락주세요</span>
                </li>
              </ul>
            </div>

            <a
              href="https://forms.gle/YOUR_GOOGLE_FORM_ID"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-deep-navy text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-slate-800 transition text-center"
            >
              <i className="fa-brands fa-google mr-2"></i>
              구글 폼으로 공식 신청하기
            </a>
            <p className="text-xs text-center text-gray-500 mt-4">
              * 구글 폼 링크는 실제 폼이 준비되면 업데이트됩니다
            </p>
          </motion.div>
        </div>
      </section>

      {/* KakaoTalk Channel Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-400 to-yellow-500 px-4 snap-start">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-3xl md:text-4xl font-bold text-deep-navy mb-4">
                카카오톡으로 더 편하게 문의하세요
              </h2>
              <p className="text-deep-navy/80 text-lg mb-8">
                실시간 상담과 빠른 답변이 필요하시다면<br />
                카카오톡 채널로 바로 입장해주세요
              </p>
            </div>
            <motion.a
              href="https://pf.kakao.com/_your_kakao_channel"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-3 bg-deep-navy text-yellow-400 px-10 py-5 rounded-xl font-bold text-lg shadow-2xl hover:bg-slate-800 transition transform"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"/>
              </svg>
              카카오톡 채널 입장하기
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-navy text-gray-400 py-12 px-4 text-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="mb-4 font-bold text-white text-lg">SMMT × NEXO</p>
            <p className="text-vibrant-orange/80 text-xs mb-2">프리미엄 전자칠판 전문 판매</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
            <div>
              <h3 className="text-white font-semibold mb-3">회사 정보</h3>
              <ul className="space-y-1.5 text-xs">
                <li><span className="text-gray-500">상호:</span> (주)넥소</li>
                <li><span className="text-gray-500">대표자:</span> 박정민</li>
                <li><span className="text-gray-500">사업자 등록번호:</span> 289-87-00638</li>
                <li><span className="text-gray-500">통신판매업신고번호:</span> 2020-인천서구-0523</li>
                <li><span className="text-gray-500">주소:</span> 인천광역시 서구 보듬로158 블루텍 527호 (제조동)</li>
                <li><span className="text-gray-500">개인정보보호책임자:</span> 장형태</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">연락처</h3>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <span className="text-gray-500">전화:</span>{' '}
                  <a href="tel:032-569-5771" className="hover:text-white transition-colors">
                    032-569-5771~2
                  </a>
                  <span className="text-gray-500 ml-1">(평일 09:00~18:00)</span>
                </li>
                <li>
                  <span className="text-gray-500">팩스:</span>{' '}
                  <a href="tel:032-568-6361" className="hover:text-white transition-colors">
                    032-568-6361
                  </a>
                  <span className="text-gray-500 ml-1">(평일 09:00~18:00)</span>
                </li>
                <li>
                  <span className="text-gray-500">이메일:</span>{' '}
                  <a href="mailto:nexo.korea.studio@gmail.com" className="hover:text-white transition-colors">
                    nexo.korea.studio@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <a href="#" className="hover:text-white transition-colors">
                이용약관
              </a>
              <a href="#" className="hover:text-white transition-colors">
                개인정보처리방침
              </a>
              <a href="#" className="hover:text-white transition-colors">
                고객센터
              </a>
            </div>
            <p className="text-center text-xs text-gray-600 mt-4">
              Copyright © 2026 (주)넥소. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating CTA Bar (Mobile) */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t-2 border-vibrant-orange shadow-2xl"
      >
        <div className="flex items-center h-16">
          <a
            href="https://pf.kakao.com/_your_kakao_channel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 text-deep-navy font-bold h-full"
          >
            <i className="fa-solid fa-comment text-lg"></i>
            <span className="text-sm">카카오톡 문의</span>
          </a>
          <a
            href="tel:032-569-5771"
            className="flex-1 flex items-center justify-center gap-2 bg-vibrant-orange text-white font-bold h-full"
          >
            <i className="fa-solid fa-phone text-lg"></i>
            <span className="text-sm">전화 상담 예약</span>
          </a>
        </div>
      </motion.div>

      <style>{`
        @keyframes pulse-animation {
          0% { box-shadow: 0 0 0 0 rgba(255, 102, 0, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 102, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 102, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
