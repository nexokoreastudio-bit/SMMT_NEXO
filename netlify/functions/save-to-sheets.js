// Netlify Function: Save Form Submission to Google Sheets
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // POST 요청만 처리
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // 환경 변수 확인
    const {
      GOOGLE_SHEET_ID,
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY,
    } = process.env;

    if (!GOOGLE_SHEET_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Missing required environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Server configuration error',
          details: 'Missing environment variables'
        }),
      };
    }

    // 폼 데이터 파싱
    const formData = JSON.parse(event.body);
    const {
      customerName,
      orgName,
      phoneNumber,
      region,
      size,
      mountType,
      quantity,
      unitPrice,
      totalPrice,
    } = formData;

    // Service Account 인증 설정
    const serviceAccountAuth = new JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Google Sheets 연결
    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();

    // 첫 번째 시트 가져오기
    const sheet = doc.sheetsByIndex[0];

    // 헤더 확인 및 추가
    const lastRow = sheet.rowCount;
    if (lastRow === 0) {
      // 헤더 추가
      await sheet.setHeaderRow([
        '제출일시',
        '원장님 성함',
        '학원명',
        '연락처',
        '지역 / 설치 환경',
        '인치 종류',
        '설치 방식',
        '구매 수량',
        '단가',
        '총 주문 금액'
      ]);
    }

    // 새 행 추가
    const row = {
      '제출일시': new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
      '원장님 성함': customerName || '',
      '학원명': orgName || '',
      '연락처': phoneNumber || '',
      '지역 / 설치 환경': region || '',
      '인치 종류': size ? `${size}인치` : '',
      '설치 방식': mountType || '',
      '구매 수량': quantity ? `${quantity}대` : '',
      '단가': unitPrice ? `${unitPrice.toLocaleString()}원` : '',
      '총 주문 금액': totalPrice ? `${totalPrice.toLocaleString()}원` : ''
    };

    await sheet.addRow(row);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: '데이터가 Google Sheets에 저장되었습니다.' 
      }),
    };
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to save to Google Sheets',
        details: error.message 
      }),
    };
  }
};
