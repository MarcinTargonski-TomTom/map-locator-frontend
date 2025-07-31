// ===== TYMCZASOWE FUNKCJE DO TESTOWANIA - DO USUNIĘCIA PÓŹNIEJ =====

interface TestAuthUtils {
  generateNewTestToken: () => string;
  setCustomToken: (token: string) => void;
  getCurrentToken: () => string | null;
  clearToken: () => void;
  checkAllTokens: () => void;
}

// Generowanie nowego testowego tokenu
export const generateNewTestToken = () => {
  const testToken = `test-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('authToken', testToken);
  console.log('🔑 Wygenerowano nowy testowy token:', testToken);
  console.log('📍 Token zapisany pod kluczem: "authToken"');
  return testToken;
};

// Ustawienie custom tokenu
export const setCustomToken = (token: string) => {
  localStorage.setItem('authToken', token);
  console.log('🔑 Ustawiono custom token:', token);
  console.log('📍 Token zapisany pod kluczem: "authToken"');
};

// Wyświetlenie aktualnego tokenu
export const getCurrentToken = () => {
  const token = localStorage.getItem('authToken') || 
                localStorage.getItem('token') ||
                sessionStorage.getItem('authToken') ||
                sessionStorage.getItem('token');
  console.log('🔍 Aktualny token:', token || 'BRAK TOKENU');
  return token;
};

// Usunięcie tokenu
export const clearToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('token');
  console.log('🗑️ Token został usunięty');
};

// Sprawdzenie wszystkich tokenów w storage
export const checkAllTokens = () => {
  console.log('🔍 Sprawdzenie wszystkich tokenów:');
  console.log('localStorage.authToken:', localStorage.getItem('authToken'));
  console.log('localStorage.token:', localStorage.getItem('token'));
  console.log('sessionStorage.authToken:', sessionStorage.getItem('authToken'));
  console.log('sessionStorage.token:', sessionStorage.getItem('token'));
};

// ===== INSTRUKCJE UŻYCIA =====
console.log(`
🧪 FUNKCJE TESTOWE DO WYKORZYSTANIA W KONSOLI:
- generateNewTestToken() - generuje nowy testowy token
- setCustomToken('twój-prawdziwy-token') - ustawia prawdziwy token
- getCurrentToken() - pokazuje aktualny token
- clearToken() - usuwa wszystkie tokeny
- checkAllTokens() - sprawdza wszystkie miejsca gdzie może być token

📝 PRZYKŁAD UŻYCIA:
1. Wygeneruj token: generateNewTestToken()
2. Lub ustaw prawdziwy: setCustomToken('Bearer abc123...')
3. Sprawdź czy działa: getCurrentToken()
4. Przetestuj API call w aplikacji
5. W razie problemów: checkAllTokens()
`);

// Udostępnienie funkcji globalnie dla łatwego dostępu z konsoli
if (typeof window !== 'undefined') {
  (window as typeof window & { testAuth: TestAuthUtils }).testAuth = {
    generateNewTestToken,
    setCustomToken,
    getCurrentToken,
    clearToken,
    checkAllTokens
  };
  console.log('🌐 Funkcje dostępne również jako: window.testAuth.funkcja()');
}
