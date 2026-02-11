// src/lib/telex.ts

// --- CẤU HÌNH DỮ LIỆU ---

const VOWELS = [
  ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
  ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
  ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
  ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
  ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
  ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
  ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
  ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
  ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
  ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
  ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
  ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
];

const TONES: Record<string, number> = { s: 1, f: 2, r: 3, x: 4, j: 5, z: 0 };

type ModifierRule = { result: string, keepKey: boolean };

const MODIFIERS: Record<string, Record<string, ModifierRule>> = {
  a: { 
    a: { result: 'â', keepKey: false },
    â: { result: 'a', keepKey: true },
    ă: { result: 'a', keepKey: true }
  },
  e: { 
    e: { result: 'ê', keepKey: false },
    ê: { result: 'e', keepKey: true }
  },
  o: { 
    o: { result: 'ô', keepKey: false },
    ô: { result: 'o', keepKey: true },
    ơ: { result: 'o', keepKey: true }
  },
  d: { 
    d: { result: 'đ', keepKey: false },
    đ: { result: 'd', keepKey: true }
  },
  w: {
    a: { result: 'ă', keepKey: false },
    ă: { result: 'a', keepKey: true },
    o: { result: 'ơ', keepKey: false },
    ơ: { result: 'o', keepKey: true },
    u: { result: 'ư', keepKey: false },
    ư: { result: 'u', keepKey: true }
  }
};

// --- HELPER FUNCTIONS ---

function getCharInfo(char: string) {
  for (let r = 0; r < VOWELS.length; r++) {
    for (let c = 0; c < VOWELS[r].length; c++) {
      if (VOWELS[r][c] === char) return { r, c, isUpper: false };
      if (VOWELS[r][c].toUpperCase() === char) return { r, c, isUpper: true };
    }
  }
  return null;
}

function extractTone(word: string): { base: string; tone: number } {
  const chars = word.split('');
  let foundTone = 0;
  for (let i = 0; i < chars.length; i++) {
    const info = getCharInfo(chars[i]);
    if (info && info.c > 0) {
      foundTone = info.c;
      const baseChar = VOWELS[info.r][0];
      chars[i] = info.isUpper ? baseChar.toUpperCase() : baseChar;
    }
  }
  return { base: chars.join(''), tone: foundTone };
}

// === THUẬT TOÁN TÌM VỊ TRÍ DẤU (ĐÃ SỬA LỖI) ===
function findToneIndex(word: string): number {
  const chars = word.toLowerCase().split('');
  const vowels: number[] = [];
  
  for (let i = 0; i < chars.length; i++) {
    if (getCharInfo(chars[i])) vowels.push(i);
  }

  if (vowels.length === 0) return -1;
  if (vowels.length === 1) return vowels[0];

  // Logic phụ trợ: Check âm cuối và cụm nguyên âm
  const lastChar = chars[chars.length - 1];
  const lastIsVowel = getCharInfo(lastChar) !== null;
  const hasEndingConsonant = !lastIsVowel;
  const vStr = vowels.map(idx => chars[idx]).join('');

  // --- ƯU TIÊN 1: NGUYÊN ÂM CÓ MŨ (The "Hat" Rule) ---
  // Đây là sửa lỗi quan trọng nhất: Nếu có ê, ô, ơ, ă, â -> Dấu CHẮC CHẮN nằm đây.
  // Ví dụ: luyên -> có ê -> dấu vào ê -> luyện. (Bất chấp có 'uy' hay không)
  for (let idx of vowels) {
    if (['ê', 'ô', 'ơ', 'ă', 'â'].includes(chars[idx])) return idx;
  }

  // --- ƯU TIÊN 2: CÁC TRƯỜNG HỢP QU/GI ---
  // qu + a -> quá (bỏ u, dấu vào a)
  // gi + a -> già (bỏ i, dấu vào a)
  if (word.startsWith('qu') || word.startsWith('gi')) {
      if (vowels.length > 1) {
          // Trả về nguyên âm thứ 2 (bỏ qua u của qu, hoặc i của gi)
          // Ví dụ: quan -> a, gia -> a
          return vowels[1]; 
      }
  }

  // --- ƯU TIÊN 3: CÁC CỤM ĐẶC BIỆT (oa, oe, uy) ---
  // Chỉ chạy nếu KHÔNG có mũ (đã check ở Ưu tiên 1)
  // Ví dụ: hoa -> hòa, thuy -> thúy, khoe -> khòe
  if (vStr.includes('oa') || vStr.includes('oe') || vStr.includes('uy')) {
      return vowels[1];
  }

  // --- ƯU TIÊN 4: NGUYÊN ÂM ĐÔI (ia, ua, ưa) ---
  if (vStr === 'ua' || vStr === 'ia' || vStr === 'ưa') {
      // Có âm cuối (uan) -> Dấu thứ 2 (uân -> đã bị bắt ở rule Mũ, uan -> uán)
      if (hasEndingConsonant) return vowels[1];
      // Không âm cuối (mua) -> Dấu thứ 1 (múa)
      return vowels[0];
  }
  
  // --- ƯU TIÊN 5: MẶC ĐỊNH ---
  // Nếu không rơi vào các case trên, đặt vào nguyên âm cuối cùng
  // Ví dụ: lo, la, lan -> o, a, a
  return vowels[vowels.length-1];
}

// --- MAIN FUNCTION ---

export function toVietnamese(input: string): string {
  if (!input || input.length < 2) return input;

  const lastSpaceIndex = input.lastIndexOf(' ');
  const prefix = lastSpaceIndex !== -1 ? input.slice(0, lastSpaceIndex + 1) : '';
  let word = lastSpaceIndex !== -1 ? input.slice(lastSpaceIndex + 1) : input;

  if (word.length < 2) return input;

  const lastKey = word.slice(-1).toLowerCase();
  const wordBase = word.slice(0, -1);
  
  let processed = false;

  // 1. MODIFIERS (a, e, o, d, w)
  if (MODIFIERS.hasOwnProperty(lastKey)) {
      const ruleGroup = MODIFIERS[lastKey];
      const chars = wordBase.split('');
      
      for (let i = chars.length - 1; i >= 0; i--) {
          const char = chars[i];
          const info = getCharInfo(char); 
          const baseChar = info ? VOWELS[info.r][0] : char.toLowerCase();

          if (ruleGroup.hasOwnProperty(baseChar)) {
              const rule = ruleGroup[baseChar];
              const currentTone = info ? info.c : 0;
              
              let newChar = rule.result;
              const targetInfo = getCharInfo(newChar);
              if (targetInfo) newChar = VOWELS[targetInfo.r][currentTone];
              else if (newChar === 'đ') newChar = 'đ';

              chars[i] = (char === char.toUpperCase()) ? newChar.toUpperCase() : newChar;
              const modifiedWord = chars.join('');

              if (rule.keepKey) word = modifiedWord + lastKey;
              else word = modifiedWord;
              
              processed = true;
              break; 
          }
      }
  }

  // 2. DẤU THANH (s, f, r, x, j, z)
  if (!processed && TONES.hasOwnProperty(lastKey)) {
      const targetTone = TONES[lastKey];
      const { base: cleanWord, tone: currentTone } = extractTone(wordBase);

      if (targetTone === currentTone && targetTone !== 0) {
          word = cleanWord + lastKey;
      } else {
          // Tạm thời đặt dấu (sẽ được auto-correct ngay bên dưới)
          const toneIdx = findToneIndex(cleanWord);
          if (toneIdx !== -1) {
              const chars = cleanWord.split('');
              const info = getCharInfo(chars[toneIdx]);
              if (info) {
                  const newChar = VOWELS[info.r][targetTone];
                  chars[toneIdx] = info.isUpper ? newChar.toUpperCase() : newChar;
                  word = chars.join('');
              }
          }
      }
      processed = true;
  }

  // 3. AUTO-CORRECT TONE POSITION (Quan trọng nhất)
  // Logic: Lấy dấu ra -> Tìm vị trí chuẩn -> Đặt lại dấu
  const { base: finalBase, tone: finalTone } = extractTone(word);
  
  if (finalTone > 0) {
      const correctIdx = findToneIndex(finalBase);
      if (correctIdx !== -1) {
          const chars = finalBase.split('');
          const info = getCharInfo(chars[correctIdx]);
          if (info) {
              const newChar = VOWELS[info.r][finalTone];
              chars[correctIdx] = info.isUpper ? newChar.toUpperCase() : newChar;
              word = chars.join('');
          }
      }
  }

  return prefix + word;
}

