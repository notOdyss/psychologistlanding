import { useState } from 'react';
import { useContent } from './content/useContent.js';

function App() {
  const content = useContent();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedDiploma, setSelectedDiploma] = useState(null);
  const [zoom, setZoom] = useState(1);

  const { hero, profile, audience, howItWorks, projects, program, diplomas, certificates } = content;

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.max(1, Math.min(5, prev * delta)));
    }
  };

  const resetZoom = () => setZoom(1);

  const closeModal = () => {
    setSelectedDiploma(null);
    setSelectedCertificate(null);
    setZoom(1);
  };

  const modalItem = selectedDiploma || selectedCertificate;

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Hero Section */}
      <section className="pt-6 pb-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            {hero.titleLine1}<br/>{hero.titleLine2}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-[#0F766E] font-semibold mb-4">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Psychologist Profile */}
      <section className="pt-2 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm sm:text-base text-[#0F766E] font-semibold uppercase tracking-wider mb-6 text-center">{profile.eyebrow}</p>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border border-gray-100">
            <div className="grid md:grid-cols-[500px_1fr] gap-4 sm:gap-8 items-start">
              {/* Left - Photo */}
              <div className="rounded-2xl overflow-hidden border-2 border-[#0F766E]/20 shadow-md">
                <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover aspect-[3/4]" />
              </div>

              {/* Right - Info */}
              <div className="flex flex-col justify-center">
                {/* Name and credentials */}
                <div className="mb-6">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    {profile.name}
                  </h2>
                  <p className="text-sm sm:text-base md:text-xl text-gray-600 leading-relaxed">
                    {profile.credentials}
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                  {profile.stats.map((stat, index) => (
                    <div key={index} className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-lg sm:rounded-xl shadow-md p-2 sm:p-4 text-center hover:shadow-lg transition-shadow">
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                      <p className="text-white/90 font-medium text-xs sm:text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">{profile.educationTitle}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {profile.education.map((country, index) => (
                      <div key={index} className="bg-[#CCFBF1] rounded-lg sm:rounded-xl p-3 sm:p-5 border-2 border-[#0F766E]/30 text-center shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{country}</p>
                      </div>
                    ))}
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
              {audience.title}
            </h2>
            <p className="text-xl text-gray-700 mb-6">
              {audience.subtitle}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
            <div className="space-y-4">
              {audience.items.map((item, index) => (
                <p key={index} className="text-xl text-gray-700">• {item}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How the Program Works Section */}
      <section className="py-10 px-6 bg-gradient-to-b from-[#fafafa] to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              {howItWorks.title}
            </h2>
          </div>

          {/* Sessions 1-3 */}
          <div className="mb-10">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{howItWorks.partOne.title}</h3>
              <p className="text-xl text-gray-600">{howItWorks.partOne.subtitle}</p>
            </div>

            <p className="text-lg text-gray-700 mb-6">{howItWorks.partOne.intro}</p>

            <div className="space-y-3 mb-6">
              {howItWorks.partOne.levels.map((level, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-[#0F766E]">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {level.title}
                    {level.note && <span className="text-base font-normal text-gray-500"> {level.note}</span>}
                  </h4>
                  <p className="text-gray-700 text-base">{level.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#0F766E] text-white rounded-2xl p-5 text-center">
              <p className="text-xl font-semibold">{howItWorks.partOne.result}</p>
            </div>
          </div>

          {/* Session 4 */}
          <div>
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{howItWorks.partTwo.title}</h3>
              <p className="text-xl text-gray-600">{howItWorks.partTwo.subtitle}</p>
            </div>

            <p className="text-lg text-gray-700 mb-6">{howItWorks.partTwo.intro}</p>

            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="space-y-3">
                {howItWorks.partTwo.items.map((item, index) => (
                  <p key={index} className="text-lg text-gray-900">✓ {item}</p>
                ))}
              </div>
            </div>

            <div className="bg-[#0F766E] text-white rounded-2xl p-5 text-center">
              <p className="text-xl font-semibold">{howItWorks.partTwo.result}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="py-10 px-6 bg-gradient-to-b from-[#fafafa] to-white">
        <div className="max-w-7xl mx-auto">

          {/* Projects Section */}
          <div className="mb-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">{projects.title}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.items.map((project, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-[#0F766E] transition-all">
                  {project.logo ? (
                    <div className="h-12 flex items-center justify-start mb-3">
                      <img src={project.logo} alt={project.name} className="h-10 w-auto object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-xl">{project.emoji}</span>
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                  <p className="text-gray-600 text-base">{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Message */}
          <div className="bg-gradient-to-r from-[#CCFBF1] to-[#CCFBF1] rounded-2xl p-6 text-center mt-8">
            <p className="text-xl text-gray-800 font-medium">
              {projects.bottomMessage}
            </p>
          </div>

        </div>
      </section>

      {/* Program CTA Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#0F766E]">

            <div className="text-center mb-8">
              <p className="text-base text-[#0F766E] font-semibold uppercase tracking-wider mb-2">{program.eyebrow}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {program.title}
              </h2>
              <p className="text-xl text-gray-600">
                {program.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#fafafa] rounded-2xl p-5 text-center border border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-1">{program.formatLabel}</p>
                <p className="text-xl font-bold text-gray-900">{program.formatValue}</p>
              </div>
              <div className="bg-[#fafafa] rounded-2xl p-5 text-center border border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-1">{program.startLabel}</p>
                <p className="text-xl font-bold text-gray-900">{program.startValue}</p>
              </div>
              <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-2xl h-[120px] flex flex-col justify-center text-center border-2 border-[#0F766E] shadow-lg">
                <p className="text-sm text-white/80 font-medium leading-none">
                  {program.priceLabel}
                </p>
                <p className="text-4xl font-bold text-white leading-none">
                  {program.priceValue}
                </p>
              </div>
            </div>

            <div className="text-center">
              <a
                href={`https://wa.me/${program.whatsappNumber}`}
                className="inline-block bg-[#0F766E] hover:bg-[#115E59] text-white font-bold px-10 py-7 rounded-full text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
              >
                {program.phoneDisplay}
              </a>
              <p className="text-lg text-gray-600 font-medium">
                {program.footnote}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Diplomas Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {diplomas.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {diplomas.items.map((diploma, index) => (
              <button
                key={index}
                onClick={() => setSelectedDiploma(diploma)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#0F766E] transition-all cursor-pointer group"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={diploma.src}
                    alt={diploma.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-gray-700 font-semibold">{diploma.title}</p>
                </div>
              </button>
            ))}

            <div className="bg-[#CCFBF1] rounded-2xl shadow-lg border-2 border-[#0F766E] flex items-center justify-center p-6 text-center hover:shadow-xl transition-shadow">
              <div>
                <p className="text-3xl mb-3">📜</p>
                <p className="text-lg font-bold text-gray-900">{diplomas.extraCardTitle}</p>
                <p className="text-gray-700 text-sm mt-2">{diplomas.extraCardSubtitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {certificates.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {certificates.items.map((cert, index) => (
              <button
                key={index}
                onClick={() => setSelectedCertificate(cert)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl hover:border-[#0F766E] transition-all cursor-pointer group"
              >
                <div className="h-80 overflow-hidden">
                  <img
                    src={cert.src}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-gray-700 font-semibold">{cert.title}</p>
                </div>
              </button>
            ))}

            <div className="bg-[#CCFBF1] rounded-2xl shadow-lg border-2 border-[#0F766E] flex items-center justify-center p-6 text-center hover:shadow-xl transition-shadow">
              <div>
                <p className="text-3xl mb-3">📜</p>
                <p className="text-lg font-bold text-gray-900">{certificates.extraCardTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal (diplomas and certificates share one) */}
      {modalItem && (
        <div
          className="fixed inset-0 bg-black/70 z-40 flex flex-col items-center justify-center p-3 sm:p-4 backdrop-blur-sm overflow-y-auto"
          onClick={closeModal}
          onWheel={handleWheel}
        >
          <div
            className="relative my-4 w-full max-w-2xl sm:max-w-3xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3 gap-2">
              <p className="text-white text-sm font-medium">
                {zoom > 1 ? `${Math.round(zoom * 100)}%` : 'Scroll to zoom'}
              </p>
              <div className="flex gap-2">
                {zoom > 1 && (
                  <button
                    onClick={() => resetZoom()}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded text-sm transition-colors"
                  >
                    Reset
                  </button>
                )}
                <button onClick={closeModal} className="text-white hover:text-gray-300 transition-colors">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center overflow-auto max-h-[calc(90vh-60px)]">
              <img
                src={modalItem.src}
                alt={modalItem.title}
                className="rounded-lg sm:rounded-2xl shadow-2xl transition-transform"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'center',
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
