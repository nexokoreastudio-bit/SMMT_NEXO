import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CountdownTimer from './CountdownTimer';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [activeFAQTab, setActiveFAQTab] = useState('기능사용');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);

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
        const inquiryType = formData.get('inquiry_type');
        if (inquiryType === 'webinar') {
          alert('웨비나 알림 신청이 완료되었습니다. 일정 확정 시 문자로 안내해드리겠습니다.');
        } else {
          alert('상담 신청이 접수되었습니다. 담당자가 곧 연락드리겠습니다.');
        }
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

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 카운트다운 타이머 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <p className="text-white text-sm md:text-base mb-3 font-semibold">공동구매 마감까지</p>
              <CountdownTimer endDate="2025-02-08T23:59:59" />
            </motion.div>

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
            <p className="text-gray-200 text-lg md:text-xl mb-10 leading-relaxed">
              SMMT 4,000명 원장님이 검증한, 오직 <strong className="text-white">'수학'</strong>을 위해 태어난 넥소(NEXO).
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.a
                href="#consult-form"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-vibrant-orange text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-orange-600 transition relative"
                style={{
                  animation: 'pulse-animation 2s infinite',
                }}
              >
                웨비나 무료 신청하기
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="pt-24 pb-20 bg-white px-4 snap-start">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-deep-navy mb-4 scroll-mt-24">
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
      <section className="pt-24 pb-20 bg-slate-100 px-4 snap-start">
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
              넥소만의 해결책, 유마인드 소프트웨어
            </h2>
            <p className="text-gray-600 mt-3">수학 수업에 최적화된 기능을 직접 확인하세요</p>
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
      <section id="price-benefit" className="pt-24 pb-20 bg-white px-4 snap-start">
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
            <p className="text-gray-600 text-base">(~00월 00일 마감)</p>
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
                    desc: '(확정된 가격)원 (정가 대비 OO% 할인)',
                  },
                  {
                    icon: <i className="fa-solid fa-tv text-xl"></i>,
                    title: '86인치 업그레이드',
                    desc: '수학 수업에 최적화된 대화면',
                  },
                  {
                    icon: <i className="fa-solid fa-truck-fast text-xl"></i>,
                    title: '설치비 및 배송비 무료',
                    desc: '지방, 계단 양중비(사다리차)까지 100% 지원',
                  },
                  {
                    icon: <i className="fa-solid fa-stand text-xl"></i>,
                    title: '스탠드 거치대 무료 증정',
                    desc: '추가 비용 없이 스탠드형 설치 지원',
                  },
                  {
                    icon: <i className="fa-solid fa-credit-card text-xl"></i>,
                    title: '최대 OO개월 무이자 할부 지원',
                    desc: '월 커피값 수준으로 부담 없이 이용 가능',
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
                      <span className="text-gray-600 text-sm md:text-base leading-relaxed block">
                        {benefit.desc}
                      </span>
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
            <h2 className="text-3xl font-bold text-deep-navy mb-2">공동구매 문의</h2>
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
                문의 유형 <span className="text-vibrant-orange">*</span>
              </label>
              <select
                id="inquiry_type"
                name="inquiry_type"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-vibrant-orange bg-white"
              >
                <option value="quote">공동구매 문의</option>
                <option value="webinar">웨비나 알림 신청</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                웨비나 알림 신청 시 일정 확정 후 문자로 안내해드립니다
              </p>
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
              문의하기
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
                  '라이브 방송 중 신청 시 추가 할인 혜택',
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
              웨비나 알림 신청하기
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
            <p className="text-vibrant-orange/80 text-xs mb-2">프리미엄 리퍼비시 IT 기기 전문 판매</p>
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
