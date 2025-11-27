import React from 'react';
import html2canvas from 'html2canvas';

function App() {
  const handleScreenshot = async () => {
    const element = document.body;
    const button = document.getElementById('screenshot-btn');

    // Hide button before screenshot
    button.style.display = 'none';

    try {
      const canvas = await html2canvas(element, {
        scale: 2, // High quality
        useCORS: true,
        logging: false,
        width: 1700, // Mobile-friendly width for customers
        windowWidth: 1700,
        backgroundColor: '#fafafa'
      });

      // Convert to PNG and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'zarina-yelbaeva-landing.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        // Show button again
        button.style.display = 'flex';
      });
    } catch (error) {
      console.error('Screenshot error:', error);
      button.style.display = 'flex';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Screenshot Button */}
      <button
        id="screenshot-btn"
        onClick={handleScreenshot}
        className="fixed bottom-6 right-6 z-50 bg-[#0F766E] hover:bg-[#115E59] text-white font-bold px-6 py-3 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        PNG жүктеу
      </button>

      {/* Hero Section */}
      <section className="pt-8 pb-2 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            2026-ға тыныш жүрекпен,<br/>анық оймен, сенімді қадаммен
          </h1>
          <p className="text-2xl text-[#0F766E] font-semibold mb-4">
            4 апталық премиум психотерапиялық бағдарлама
          </p>
        </div>
      </section>

      {/* Psychologist Profile */}
      <section className="pt-2 pb-8 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-base text-[#0F766E] font-semibold uppercase tracking-wider mb-6 text-center">Кім мен?</p>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="grid md:grid-cols-[500px_1fr] gap-8 items-start">
              {/* Left - Photo */}
              <div className="rounded-2xl overflow-hidden border-2 border-[#0F766E]/20 shadow-md">
                <img src="/images/psychologist2.jpg" alt="Зарина Ельбаева" className="w-full h-full object-cover aspect-[3/4]" />
              </div>

              {/* Right - Info */}
              <div className="flex flex-col justify-center">
                {/* Name and credentials */}
                <div className="mb-6">
                  <h2 className="text-5xl font-bold text-gray-900 mb-3">
                    Зарина Ельбаева
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    PhD доктор • Қауымдастырылған профессор • Практик психолог
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl font-bold text-white mb-1">15+</div>
                    <p className="text-white/90 font-medium text-sm">жыл тәжірибе</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl font-bold text-white mb-1">5000+</div>
                    <p className="text-white/90 font-medium text-sm">сағат консультация</p>
                  </div>
                  <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-xl shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl font-bold text-white mb-1">20+</div>
                    <p className="text-white/90 font-medium text-sm">біліктілік курсы</p>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Білім:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#CCFBF1] rounded-xl p-5 border-2 border-[#0F766E]/30 text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-lg font-bold text-gray-900">Қазақстан</p>
                    </div>
                    <div className="bg-[#CCFBF1] rounded-xl p-5 border-2 border-[#0F766E]/30 text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-lg font-bold text-gray-900">Германия</p>
                    </div>
                    <div className="bg-[#CCFBF1] rounded-xl p-5 border-2 border-[#0F766E]/30 text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-lg font-bold text-gray-900">Оңтүстік Корея</p>
                    </div>
                    <div className="bg-[#CCFBF1] rounded-xl p-5 border-2 border-[#0F766E]/30 text-center shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-lg font-bold text-gray-900">Украина</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is the Program For Section */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Бұл бағдарлама кімге арналған?
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              Негізгі бір сұранысын терең деңгейде шешкісі келетін адамдарға:
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
            <div className="space-y-4">
              <p className="text-xl text-gray-700">• Жолдасымен қарым-қатынасты реттеу</p>
              <p className="text-xl text-gray-700">• Өзін-өзі бағалау мен ішкі сенімді қалпына келтіру</p>
              <p className="text-xl text-gray-700">• Уайым, қорқыныш, ішкі қысымнан шығу</p>
              <p className="text-xl text-gray-700">• Өзінің нағыз тілегін, бағытын табу</p>
              <p className="text-xl text-gray-700">• Бір жағдайдан ұзақ шыға алмай жүргендерге</p>
            </div>
          </div>
        </div>
      </section>

      {/* How the Program Works Section */}
      <section className="py-10 px-6 bg-gradient-to-b from-[#fafafa] to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Бағдарлама қалай жұмыс істейді?
            </h2>
          </div>

          {/* Sessions 1-3 */}
          <div className="mb-10">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1–3 сессия</h3>
              <p className="text-xl text-gray-600">Негізгі сұранысты толық шешу</p>
            </div>

            <p className="text-lg text-gray-700 mb-6">Бір сұраныс 3 деңгейде қарастырылады:</p>

            <div className="space-y-3 mb-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-[#0F766E]">
                <h4 className="text-xl font-bold text-gray-900 mb-1">1. Ойлау <span className="text-base font-normal text-gray-500">(ментальды деңгей)</span></h4>
                <p className="text-gray-700 text-base">Шектеулер мен қорқыныштар трансформацияланады.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-[#0F766E]">
                <h4 className="text-xl font-bold text-gray-900 mb-1">2. Күй мен дене <span className="text-base font-normal text-gray-500">(эмоционалды-физиологиялық деңгей)</span></h4>
                <p className="text-gray-700 text-base">Ішкі тыныштық пен тұрақтылық қалыптасады.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-[#0F766E]">
                <h4 className="text-xl font-bold text-gray-900 mb-1">3. Жаңа мінез-құлық <span className="text-base font-normal text-gray-500">(поведенческий деңгей)</span></h4>
                <p className="text-gray-700 text-base">Егер тағы қысқарту керек болса</p>
              </div>
            </div>

            <div className="bg-[#0F766E] text-white rounded-2xl p-5 text-center">
              <p className="text-xl font-semibold">Нәтиже: анықтық, ішкі ресурс</p>
            </div>
          </div>

          {/* Session 4 */}
          <div>
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">4 сессия</h3>
              <p className="text-xl text-gray-600">2026 жылға жеке мақсат қою</p>
            </div>

            <p className="text-lg text-gray-700 mb-6">Сіздің нағыз қалауыңызға сай:</p>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="space-y-3">
                <p className="text-lg text-gray-900">✓ Жылдық мақсат</p>
                <p className="text-lg text-gray-900">✓ Нақты қадамдар жоспары</p>
                <p className="text-lg text-gray-900">✓ Ішкі тірек</p>
                <p className="text-lg text-gray-900">✓ Мінез-құлық стратегиясы</p>
              </div>
            </div>

            <div className="bg-[#0F766E] text-white rounded-2xl p-5 text-center">
              <p className="text-xl font-semibold">2026 жылға жеке карта</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-10 px-6 bg-gradient-to-b from-[#fafafa] to-white">
        <div className="max-w-7xl mx-auto">

          {/* Projects Section */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">5 ірі жобалық жұмыс</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F766E] transition-all">
                <div className="h-12 flex items-center justify-start mb-3">
                  <img src="/images/atameken.png" alt="Атамекен" className="h-10 w-auto object-contain" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">«Атамекен»</h4>
                <p className="text-gray-600 text-base">Кәсіпкерлермен психологиялық жұмыс</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F766E] transition-all">
                <div className="h-12 flex items-center justify-start mb-3">
                  <img src="/images/halyk.png" alt="Халық Банк" className="h-10 w-auto object-contain" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">«Халық Банк»</h4>
                <p className="text-gray-600 text-base">Командамен психологиялық жұмыс</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F766E] transition-all">
                <div className="h-12 flex items-center justify-start mb-3">
                  <img src="/images/ruhani.jpg" alt="Рухани жаңғыру" className="h-10 w-auto object-contain" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">«Рухани жаңғыру»</h4>
                <p className="text-gray-600 text-base">Қазақстанның әр қаласындағы психологтармен жұмыс</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F766E] transition-all">
                <div className="h-12 flex items-center justify-start mb-3">
                  <img src="/images/airastana.jpg" alt="Эйр Астана" className="h-10 w-auto object-contain" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Эйр Астана</h4>
                <p className="text-gray-600 text-base">Командамен психологиялық жұмыс</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F766E] transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">🚀</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">«Прорыв» жобасы</h4>
                <p className="text-gray-600 text-base">Кәсіпкерлермен психологиялық жұмыс</p>
              </div>

              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F766E] transition-all">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <span className="text-xl">🔬</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Ғылыми жұмыстар</h4>
                <p className="text-gray-600 text-base">2 ғылыми-зерттеу жобасы</p>
              </div>

            </div>
          </div>

          {/* Bottom Message */}
          <div className="bg-gradient-to-r from-[#CCFBF1] to-[#CCFBF1] rounded-2xl p-6 text-center mt-8">
            <p className="text-xl text-gray-800 font-medium">
              Мен сіздің сұранысыңызды түсініп, нақты өзгеріске жеткізетін жүйелік тәсілмен жұмыс істеймін.
            </p>
          </div>

        </div>
      </section>

      {/* Program CTA Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#0F766E]">

            <div className="text-center mb-8">
              <p className="text-base text-[#0F766E] font-semibold uppercase tracking-wider mb-2">Премиум бағдарлама</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Бағдарлама туралы
              </h2>
              <p className="text-xl text-gray-600">
                Негізгі бір сұранысын терең деңгейде шешкісі келетін адамдарға
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#fafafa] rounded-2xl p-5 text-center border border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-1">Формат</p>
                <p className="text-xl font-bold text-gray-900">онлайн / офлайн</p>
              </div>
              <div className="bg-[#fafafa] rounded-2xl p-5 text-center border border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-1">Старт</p>
                <p className="text-xl font-bold text-gray-900">1 желтоқсан</p>
              </div>
              <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6]
rounded-2xl
h-[120px]
flex flex-col justify-center
text-center
border-2 border-[#0F766E]
shadow-lg">
  <p className="text-sm text-white/80 font-medium leading-none">
    Баға
  </p>
  <p className="text-4xl font-bold text-white leading-none">
    300 000 ₸
  </p>
</div>

            </div>

            <div className="text-center">
              <a
                href="https://wa.me/77079562033"
                className="inline-block bg-[#0F766E] hover:bg-[#115E59] text-white font-bold px-10 py-7 rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
              >
                +7 707 956 20 33
              </a>
              <p className="text-lg text-gray-600 font-medium">
                Жаңа жылға дейін өзіңізді жаңа деңгейге шығарыңыз
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Сертификаттар
            </h2>
            <p className="text-xl text-gray-600">
              Мұғалімнің біліктілігі мен тәжірибесінің куәлігі
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              <iframe
                src="/880914402487-20251127100548165.pdf"
                className="w-full h-80"
                title="Certificate 1"
              ></iframe>
              <div className="p-4 text-center">
                <p className="text-gray-700 font-semibold">Сертификат 1</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              <iframe
                src="/images/880914402487-20251127100528417.pdf"
                className="w-full h-80"
                title="Certificate 2"
              ></iframe>
              <div className="p-4 text-center">
                <p className="text-gray-700 font-semibold">Сертификат 2</p>
              </div>
            </div>

            <div className="bg-[#CCFBF1] rounded-2xl shadow-lg border-2 border-[#0F766E] flex items-center justify-center p-6 text-center hover:shadow-xl transition-shadow">
              <div>
                <p className="text-3xl mb-3">📜</p>
                <p className="text-lg font-bold text-gray-900">Көбінесе сертификаттар</p>
                <p className="text-gray-700 text-sm mt-2">Батасы өндіктілігінің куәлігі</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;
