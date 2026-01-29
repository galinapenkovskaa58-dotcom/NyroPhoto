
import React, { useState, useEffect, useMemo } from 'react';
import Assistant from './components/Assistant';
import {
  PrimaryButton,
  SecondaryButton,
  WarmButton,
  BottomBar,
  Input,
  Card,
} from './components/UI';
import { Branch, TariffType, BookingData, GiftData, QuestionData, Lead, RequestStatus, QuizState, ReferenceItem, ChatMessage } from './types';
import { TARIFFS, STYLE_CATEGORIES, SUPER_ADMIN_ID, VSPYSHKA_AVATARS, QUIZ_QUESTIONS } from './constants';
import { submitToGoogleSheets } from './services/sheets';
import { 
  sendAdminNotification, 
  formatBookingMessage, 
  formatGiftMessage, 
  formatQuestionMessage 
} from './services/notifications';

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center justify-between mb-8 px-6 pt-2">
    <div className="flex-1 h-1 bg-white/5 rounded-full mr-4 overflow-hidden">
      <div
        className="h-full bg-wave-gradient rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${(current / total) * 100}%`, boxShadow: '0 0 15px rgba(55, 217, 255, 0.5)' }}
      ></div>
    </div>
    <span className="text-[9px] text-textMuted uppercase font-black tracking-[0.2em]">
      {current} / {total}
    </span>
  </div>
);

const SelectionStickyBar: React.FC<{ selected: number; limit: number }> = ({ selected, limit }) => {
  const percentage = (selected / limit) * 100;
  const isFull = selected === limit;

  return (
    <div className="sticky top-0 z-[60] -mx-6 px-6 py-4 bg-bgPrimary/90 backdrop-blur-xl border-b border-white/5 mb-8 animate-ethereal-in">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-textMuted">
          Выбрано образов
        </span>
        <span className={`text-xs font-black tracking-tighter ${isFull ? 'text-neonPink animate-pulse' : 'text-neonCyan'}`}>
          {selected} из {limit}
        </span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ease-out ${isFull ? 'bg-primary-btn' : 'bg-neonCyan'}`}
          style={{ 
            width: `${percentage}%`,
            boxShadow: isFull ? '0 0 20px rgba(255, 79, 216, 0.4)' : '0 0 15px rgba(55, 217, 255, 0.3)'
          }}
        ></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  // --- STATE ---
  const [branch, setBranch] = useState<Branch | 'idle'>('idle');
  const [step, setStep] = useState(0);
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showEditsInfo, setShowEditsInfo] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [recommendation, setRecommendation] = useState<{ tariff: TariffType, styles: string[] } | null>(null);

  const [adminList, setAdminList] = useState<number[]>(() => {
    const saved = localStorage.getItem('dream_aux_admins');
    return saved ? JSON.parse(saved) : [];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('dream_leads');
    return saved ? JSON.parse(saved) : [];
  });

  // --- DATA ---
  const isSuperAdmin = currentUserId === SUPER_ADMIN_ID;
  const isAnyAdmin = isSuperAdmin || adminList.includes(currentUserId || 0);
  
  const userLeads = useMemo(() => {
    if (!currentUserId) return [];
    return leads.filter(l => l.chatId === currentUserId);
  }, [leads, currentUserId]);
  
  const hasPersonalHistory = userLeads.length > 0;

  const [booking, setBooking] = useState<BookingData>({
    tariff: null, styles: [], references: '', references_list: [{ url: '', comment: '' }],
    preferredTime: '', userName: '', telegramUsername: '', phone: '', comment: '',
  });

  const [gift, setGift] = useState<GiftData>({
    forWhom: '', recipientName: '', recipientAge: '', recipientTelegram: '', tariff: '',
    isBeautiful: true, userName: '', telegramUsername: '', phone: '',
  });

  const [question, setQuestion] = useState<QuestionData>({ text: '', userName: '', telegramUsername: '', phone: '' });

  // --- EFFECTS ---
  useEffect(() => {
    // @ts-ignore
    const tg = window.Telegram?.WebApp;
    const user = tg?.initDataUnsafe?.user;
    
    if (user) {
      setCurrentUserId(user.id);
      const username = user.username ? `@${user.username}` : '';
      if (!clientName && user.first_name) setClientName(user.first_name);
      
      const updateData = (prev: any) => ({
        ...prev,
        telegramUsername: username,
        userName: user.first_name || '',
        chatId: user.id
      });
      setBooking(updateData);
      setGift(updateData);
      setQuestion(updateData);
    } else {
      // For development
      setCurrentUserId(SUPER_ADMIN_ID);
    }
  }, []);

  // --- HANDLERS ---
  const resetApp = () => {
    setBranch('idle'); setStep(0); setLoading(false);
    setShowLimitModal(false); setShowSuccessModal(false); setShowEditsInfo(false);
    setQuiz(null); setRecommendation(null);
  };

  const handleRefChange = (index: number, field: keyof ReferenceItem, value: string) => {
    const newList = [...booking.references_list];
    newList[index][field] = value;
    
    if (index === newList.length - 1 && field === 'url' && value.trim() !== '') {
      newList.push({ url: '', comment: '' });
    }
    
    setBooking({ ...booking, references_list: newList });
  };

  const saveLead = (lead: Lead) => {
    const updated = [...leads, lead];
    setLeads(updated);
    localStorage.setItem('dream_leads', JSON.stringify(updated));
  };

  const updateLeadStatus = (id: string, status: RequestStatus, newHistory?: ChatMessage[]) => {
    const updated = leads.map(l => {
      if (l.id === id) {
        return { 
          ...l, 
          status, 
          chatHistory: newHistory || l.chatHistory 
        };
      }
      return l;
    });
    setLeads(updated);
    localStorage.setItem('dream_leads', JSON.stringify(updated));
  };

  const handleQuizAnswer = (answer: string) => {
    if (!quiz) return;
    const nextStep = quiz.step + 1;
    const newAnswers = { ...quiz.answers };
    if (quiz.step === 1) newAnswers.purpose = answer;
    if (quiz.step === 2) newAnswers.vibe = answer;
    if (quiz.step === 3) newAnswers.volume = answer;

    if (nextStep > 3) {
      let recTariff = TariffType.STANDARD;
      if (newAnswers.volume === 'max') recTariff = TariffType.VIP;
      else if (newAnswers.volume === 'middle') recTariff = TariffType.PRO;
      const limit = TARIFFS.find(t => t.type === recTariff)?.stylesLimit || 3;
      const category = QUIZ_QUESTIONS.vibe.options.find(o => o.id === newAnswers.vibe)?.category;
      const styles = STYLE_CATEGORIES.find(c => c.title === category)?.items.slice(0, limit).map(i => i.name) || [];
      setRecommendation({ tariff: recTariff, styles });
      setQuiz(null);
    } else {
      setQuiz({ step: nextStep, answers: newAnswers });
    }
  };

  const createInitialHistory = (text: string): ChatMessage[] => [{
    id: Math.random().toString(36).substr(2, 9),
    text,
    sender: 'user',
    timestamp: new Date().toISOString()
  }];

  const handleBookingSubmit = async () => {
    setLoading(true);
    const validRefs = booking.references_list.filter(r => r.url.trim() !== '');
    const refsString = validRefs
      .map((r, i) => `${i + 1}. ${r.url}${r.comment ? ` — ${r.comment}` : ''}`)
      .join('\n');

    const initialText = `Заявка на фотосессию: Тариф ${booking.tariff}, Стили: ${booking.styles.join(', ')}`;

    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(),
      status: 'new', type: 'booking', userName: booking.userName || clientName,
      telegramUsername: booking.telegramUsername, phone: booking.phone,
      tariff: booking.tariff || TariffType.STANDARD, styles: booking.styles,
      references: refsString, preferredTime: booking.preferredTime, chatId: currentUserId || 0,
      chatHistory: createInitialHistory(initialText)
    };
    
    const success = await submitToGoogleSheets({ 
      branch: 'booking', 
      user_name: lead.userName, 
      telegram_username: lead.telegramUsername, 
      tariff: String(lead.tariff), 
      styles_selected: lead.styles.join(', '), 
      references: lead.references 
    });
    
    if (success) { sendAdminNotification(formatBookingMessage(lead)); saveLead(lead); setStep(100); }
    setLoading(false);
  };

  const handleGiftSubmit = async () => {
    setLoading(true);
    const initialText = `Заказ сертификата ${gift.tariff} для ${gift.recipientName}`;
    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(),
      status: 'new', type: 'gift', userName: gift.userName || clientName,
      telegramUsername: gift.telegramUsername, phone: gift.phone,
      recipientName: gift.recipientName, recipientAge: gift.recipientAge,
      recipientTelegram: gift.recipientTelegram, tariff: gift.tariff, chatId: currentUserId || 0,
      chatHistory: createInitialHistory(initialText)
    };
    const success = await submitToGoogleSheets({ 
      branch: 'gift', user_name: lead.userName, telegram_username: lead.telegramUsername, 
      gift_for_whom: lead.recipientName, gift_tariff_or_amount: lead.tariff 
    });
    if (success) { sendAdminNotification(formatGiftMessage(lead)); saveLead(lead); setStep(100); }
    setLoading(false);
  };

  const handleQuestionSubmit = async () => {
    setLoading(true);
    const lead: Lead = {
      id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(),
      status: 'new', type: 'question', userName: question.userName || clientName,
      telegramUsername: question.telegramUsername, phone: question.phone,
      question: question.text, chatId: currentUserId || 0,
      chatHistory: createInitialHistory(question.text)
    };
    const success = await submitToGoogleSheets({ 
      branch: 'question', user_name: lead.userName, telegram_username: lead.telegramUsername, question_text: lead.question 
    });
    if (success) { sendAdminNotification(formatQuestionMessage(lead)); saveLead(lead); setStep(100); }
    setLoading(false);
  };

  // --- RENDER HELPERS ---
  const renderOverlays = () => (
    <>
      {previewImage && (
        <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/95 p-4" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} className="max-w-full max-h-full rounded-3xl border border-white/10 shadow-2xl animate-modal-in" alt="Preview" />
        </div>
      )}

      {showEditsInfo && (
        <div className="fixed inset-0 z-[4600] flex items-center justify-center p-6 bg-black/80 backdrop-blur-lg animate-ethereal-in">
          <div className="glass p-10 rounded-[3.5rem] border-2 border-neonViolet glow-violet animate-modal-in max-w-sm text-center">
            <div className="w-20 h-20 mx-auto mb-6"><img src={VSPYSHKA_AVATARS.eureka} className="w-full h-full object-contain" alt="Вспышка" /></div>
            <h4 className="text-xl font-black text-white mb-4 uppercase tracking-tight italic">Что такое правки? ✨</h4>
            <p className="text-sm text-textSecondary leading-relaxed mb-10 text-left">
              Это небольшие корректировки на готовых фото: <br/><br/>
              ✅ Изменить цвет глаз или оттенок волос <br/>
              ✅ Убрать мелкий лишний объект на фоне <br/>
              ✅ Легкая ретушь кожи <br/><br/>
              <b>Важно:</b> Полная смена стиля, позы или всего образа не входит в правки и считается как новый образ.
            </p>
            <PrimaryButton onClick={() => setShowEditsInfo(false)}>Всё понятно ✨</PrimaryButton>
          </div>
        </div>
      )}
      
      {showSuccessModal && (
        <div className="fixed inset-0 z-[4500] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-ethereal-in">
          <div className="glass p-10 rounded-[3.5rem] text-center max-w-sm border-2 border-neonCyan shadow-[0_0_100px_rgba(55,217,255,0.3)] animate-modal-in relative overflow-hidden">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-neonCyan/30 blur-2xl rounded-full animate-pulse"></div>
              <img src={VSPYSHKA_AVATARS.celebrating} className="w-full h-full object-contain animate-float relative z-10" alt="Вспышка" />
            </div>
            <h4 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter italic">Потрясающе! ✨</h4>
            <div className="text-[10px] font-black text-neonCyan uppercase tracking-[0.3em] mb-8">Выбор завершен</div>
            <p className="text-sm text-textSecondary mb-10 leading-relaxed">
              Ты набрал(а) максимум стилей для своего тарифа! Давай перейдем к последним деталям твоего заказа 😍
            </p>
            <PrimaryButton onClick={() => { setShowSuccessModal(false); setStep(3); }}>Продолжить ✨</PrimaryButton>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="fixed inset-0 z-[4500] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-ethereal-in">
          <div className="glass p-10 rounded-[3.5rem] text-center max-w-sm border-neonPink/50 animate-modal-in shadow-[0_0_60px_rgba(255,79,216,0.2)]">
            <div className="w-24 h-24 mx-auto mb-6"><img src={VSPYSHKA_AVATARS.thinking} className="w-full h-full object-contain" alt="Вспышка" /></div>
            <h4 className="text-xl font-black text-neonPink mb-3 uppercase tracking-tight">Лимит достигнут</h4>
            <p className="text-sm text-textSecondary mb-8 leading-relaxed">В этом тарифе доступно именно столько образов. Если хочешь больше — выбери тариф PRO или VIP! 💖</p>
            <div className="space-y-4">
              <PrimaryButton onClick={() => { setShowLimitModal(false); setStep(3); }}>Идти дальше ✨</PrimaryButton>
              <button onClick={() => setShowLimitModal(false)} className="text-[10px] font-black uppercase text-white/40 tracking-widest py-2">Изменить выбор</button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderContent = () => {
    if (branch === 'admin') return <AdminDashboard leads={leads} onUpdateStatus={updateLeadStatus} onBack={() => setBranch('idle')} isSuperAdmin={isSuperAdmin} adminList={adminList} onAddAdmin={id => setAdminList([...adminList, id])} onRemoveAdmin={id => setAdminList(adminList.filter(a => a !== id))} />;
    if (branch === 'profile') return <Profile leads={userLeads} onBack={() => setBranch('idle')} />;
    
    if (step === 100) return (
      <div className="p-6 h-screen flex flex-col justify-center text-center animate-ethereal-in">
        <Assistant message="Готово! Я передала твою заявку 😍 Галина скоро напишет тебе ✨" avatarUrl={VSPYSHKA_AVATARS.celebrating} side="center" />
        <div className="mt-12 space-y-4">
          <WarmButton onClick={() => setBranch('profile')}>💼 Мои заявки</WarmButton>
          <SecondaryButton onClick={resetApp}>Вернуться в начало</SecondaryButton>
        </div>
      </div>
    );

    if (branch === 'idle') return (
      <div className="p-6 h-screen flex flex-col justify-center relative animate-ethereal-in">
        <Assistant message={`Привет! Я Вспышка ✨📸 Помощница DreamStudio. Как тебя зовут?`} avatarUrl={VSPYSHKA_AVATARS.professional} />
        <Input label="Твоё имя" value={clientName} onChange={setClientName} placeholder="Например: Ольга" />
        <div className="mt-12 space-y-4">
          <PrimaryButton disabled={!clientName} onClick={() => { setBranch('booking'); setStep(1); }}>📸 Записаться на нейрофотосессию</PrimaryButton>
          {(hasPersonalHistory || isAnyAdmin) && <WarmButton onClick={() => setBranch('profile')}>💼 Личный кабинет</WarmButton>}
          {isAnyAdmin && <SecondaryButton onClick={() => setBranch('admin')} className="border-neonPink/40 text-neonPink bg-neonPink/5">🛡️ Панель управления</SecondaryButton>}
          <div className="grid grid-cols-2 gap-4">
            <SecondaryButton disabled={!clientName} onClick={() => { setBranch('gift'); setStep(1); }}>🎁 Подарок</SecondaryButton>
            <SecondaryButton disabled={!clientName} onClick={() => { setBranch('question'); setStep(1); }}>❓ Вопрос</SecondaryButton>
          </div>
        </div>
      </div>
    );

    if (branch === 'booking') {
      const selectedTariff = TARIFFS.find(t => t.type === booking.tariff);
      const limit = selectedTariff?.stylesLimit || 3;

      if (quiz) {
        const q = quiz.step === 1 ? QUIZ_QUESTIONS.purpose : quiz.step === 2 ? QUIZ_QUESTIONS.vibe : quiz.step === 3 ? QUIZ_QUESTIONS.volume : null;
        return q && (
          <div className="p-6 h-screen flex flex-col justify-center animate-ethereal-in">
            <Assistant message={q.question} side="left" avatarUrl={VSPYSHKA_AVATARS.thinking} />
            <div className="mt-10 space-y-3">
              {q.options.map(opt => <SecondaryButton key={opt.id} onClick={() => handleQuizAnswer(opt.id)}>{opt.label}</SecondaryButton>)}
              <button onClick={() => setQuiz(null)} className="mt-6 text-[10px] text-textMuted uppercase block mx-auto opacity-50">Пропустить</button>
            </div>
          </div>
        );
      }
      
      if (recommendation) {
        return (
          <div className="p-6 h-screen flex flex-col justify-center animate-ethereal-in">
            <Assistant message="Я подобрала для тебя идеальный вариант! 😍" avatarUrl={VSPYSHKA_AVATARS.eureka} side="center" />
            <div className="glass p-8 rounded-[3rem] border-2 border-neonCyan glow-blue mb-10 text-center">
              <h3 className="text-3xl font-black mt-2 mb-4">{recommendation.tariff}</h3>
              <p className="text-sm text-textSecondary italic">Стили: {recommendation.styles.join(', ')}</p>
            </div>
            <div className="space-y-4">
              <PrimaryButton onClick={() => { setBooking({...booking, tariff: recommendation.tariff, styles: recommendation.styles}); setRecommendation(null); setStep(3); }}>Принять и продолжить ✨</PrimaryButton>
              <SecondaryButton onClick={() => setRecommendation(null)}>Выбрать вручную</SecondaryButton>
            </div>
          </div>
        );
      }

      if (step === 1) return (
        <div className="p-6 animate-ethereal-in">
          <ProgressBar current={1} total={7} />
          <Assistant message="Выбери тариф ✨ Или давай я помогу тебе с выбором?" avatarUrl={VSPYSHKA_AVATARS.neutral} />
          <WarmButton onClick={() => setQuiz({step: 1, answers: {purpose:'', vibe:'', volume:''}})} className="mb-8 border-2 border-neonCyan">✨ Помоги выбрать!</WarmButton>
          <div className="space-y-6">
            {TARIFFS.map(t => (
              <Card key={t.type} selected={booking.tariff === t.type} onClick={() => setBooking({...booking, tariff: t.type})}>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-black text-2xl uppercase italic tracking-tighter">{t.type}</span>
                  <span className="text-2xl font-black text-neonCyan">{t.price}</span>
                </div>
                
                <div className="flex space-x-3 mb-5">
                   <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                      <span className="text-[10px]">📸</span>
                      <span className="text-[10px] font-black text-white/90 uppercase tracking-tighter">{t.photos} фото</span>
                   </div>
                   <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                      <span className="text-[10px]">✨</span>
                      <span className="text-[10px] font-black text-white/90 uppercase tracking-tighter">{t.stylesLimit} образов</span>
                   </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/5">
                  {t.features.map((f, i) => (
                    <div key={i} className="text-[11px] text-textSecondary font-medium flex items-start leading-tight">
                      <span className="text-neonPink mr-3 mt-1 text-[8px]">✦</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="h-4"></div>
              </Card>
            ))}
          </div>
          <div className="mt-12 space-y-4">
            <PrimaryButton disabled={!booking.tariff} onClick={() => setStep(2)}>Далее</PrimaryButton>
            <SecondaryButton onClick={resetApp}>Назад</SecondaryButton>
          </div>
        </div>
      );
      
      if (step === 2) return (
        <div className="p-6 pb-64 animate-ethereal-in">
          <ProgressBar current={2} total={7} />
          <SelectionStickyBar selected={booking.styles.length} limit={limit} />
          <Assistant 
            message={`Выбери до ${limit} стилей ✨ Нажми на фото, чтобы увеличить.`} 
            avatarUrl={VSPYSHKA_AVATARS.professional}
          />
          <div className="space-y-8 mt-4">
            {STYLE_CATEGORIES.map(cat => (
              <div key={cat.title} className="glass rounded-[2.5rem] p-6 border-white/5">
                <h3 className="text-sm font-black text-white/90 uppercase mb-5 tracking-widest border-l-4 border-neonPink pl-3">{cat.title}</h3>
                <div className="space-y-6">
                  {cat.items.map(style => {
                    const isSel = booking.styles.includes(style.name);
                    return (
                      <div key={style.id} className={`p-5 rounded-[2.2rem] border-2 transition-all duration-300 relative ${isSel ? 'border-neonCyan bg-neonCyan/5 glow-blue' : 'border-white/5 bg-white/[0.02]'}`} 
                           onClick={() => {
                             if (isSel) { setBooking({...booking, styles: booking.styles.filter(s => s !== style.name)}); }
                             else if (booking.styles.length < limit) {
                               const next = [...booking.styles, style.name];
                               setBooking({...booking, styles: next});
                               if (next.length === limit) {
                                 setTimeout(() => setShowSuccessModal(true), 200);
                               }
                             } else { setShowLimitModal(true); }
                           }}>
                        <div className="flex justify-between items-center mb-4"><span className="font-bold text-xs text-white/80">{style.name}</span>{isSel && <span className="w-5 h-5 bg-neonCyan text-bgPrimary rounded-full flex items-center justify-center text-[10px] font-black">✓</span>}</div>
                        {style.images && <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-1">{style.images.map(img => <img key={img} src={img} className="w-24 h-32 object-cover rounded-2xl border border-white/10 active:scale-95 transition-all hover:brightness-110" onClick={e => {e.stopPropagation(); setPreviewImage(img);}} />)}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <BottomBar><div className="space-y-3 p-6"><PrimaryButton onClick={() => setStep(3)}>Продолжить ✨</PrimaryButton><SecondaryButton onClick={() => setStep(1)}>Назад к тарифам</SecondaryButton></div></BottomBar>
        </div>
      );
      
      if (step === 3) return (
        <div className="p-6 animate-ethereal-in">
          <ProgressBar current={3} total={7} />
          <Assistant message="Если есть примеры — прикрепи ссылки на них! И добавь небольшое описание, чтобы я лучше тебя поняла 💛" avatarUrl={VSPYSHKA_AVATARS.thinking} />
          
          <div className="mt-10 space-y-6">
            {booking.references_list.map((ref, idx) => (
              <div key={idx} className="glass p-6 rounded-[2.2rem] border-white/10 space-y-4 animate-modal-in">
                <div className="flex items-center space-x-2 mb-1 pl-1">
                  <span className="text-[9px] font-black text-neonCyan uppercase tracking-widest">Пример #{idx + 1}</span>
                </div>
                <Input 
                  label="Ссылка на фото/Pinterest" 
                  placeholder="https://..." 
                  value={ref.url} 
                  onChange={(val) => handleRefChange(idx, 'url', val)} 
                />
                <Input 
                  label="Что именно нравится здесь?" 
                  placeholder="Напр: свет, поза или цвета" 
                  value={ref.comment} 
                  onChange={(val) => handleRefChange(idx, 'comment', val)} 
                />
              </div>
            ))}
          </div>

          <div className="mt-12 space-y-4">
            <PrimaryButton onClick={() => setStep(4)}>Далее ✨</PrimaryButton>
            <SecondaryButton onClick={() => setStep(2)}>Назад к стилям</SecondaryButton>
          </div>
        </div>
      );
      
      if (step === 4) return (
        <div className="p-6 animate-ethereal-in">
          <ProgressBar current={4} total={7} />
          <Assistant message="Когда планируем твою идеальную съемку? ✨" avatarUrl={VSPYSHKA_AVATARS.neutral} />
          <div className="mt-12 space-y-4">{['Очень срочно', 'В течение недели', 'Я не тороплюсь'].map(t => <SecondaryButton key={t} onClick={() => { setBooking({...booking, preferredTime: t}); setStep(5); }}>{t}</SecondaryButton>)}<div className="pt-6"><SecondaryButton onClick={() => setStep(3)}>Назад</SecondaryButton></div></div>
        </div>
      );
      
      if (step === 5) return (
        <div className="p-6 animate-ethereal-in">
          <ProgressBar current={5} total={7} />
          <Assistant message="Почти готово! Оставь Telegram для связи ✨" avatarUrl={VSPYSHKA_AVATARS.happy} />
          <div className="mt-12 space-y-8"><Input label="Telegram (@username)" value={booking.telegramUsername} onChange={v => setBooking({...booking, telegramUsername: v})} required /><Input label="Телефон (необязательно)" value={booking.phone} onChange={v => setBooking({...booking, phone: v})} type="tel" /></div>
          <div className="mt-12 space-y-4"><PrimaryButton disabled={!booking.telegramUsername} onClick={() => setStep(6)}>Далее</PrimaryButton><SecondaryButton onClick={() => setStep(4)}>Назад</SecondaryButton></div>
        </div>
      );
      
      if (step === 6) return (
        <div className="p-6 animate-ethereal-in">
          <ProgressBar current={6} total={7} />
          <Assistant message="Важные моменты! Прочитай внимательно условия ✨" avatarUrl={VSPYSHKA_AVATARS.serious} />
          <div className="glass p-10 rounded-[3rem] border-neonCyan/20 mt-12 space-y-8 text-sm leading-relaxed">
            <div className="flex items-center"><span className="text-neonCyan mr-5 text-2xl">💎</span><div><span className="block font-black uppercase text-[10px] text-white/40">Оплата</span>Предоплата 50%</div></div>
            <div className="flex items-center"><span className="text-neonCyan mr-5 text-2xl">⏳</span><div><span className="block font-black uppercase text-[10px] text-white/40">Срок</span>Готовность до 7 дней</div></div>
            <div className="flex items-center justify-between group">
              <div className="flex items-center">
                <span className="text-neonCyan mr-5 text-2xl">✨</span>
                <div>
                  <span className="block font-black uppercase text-[10px] text-white/40">Правки</span>
                  3 правки включены
                </div>
              </div>
              <button 
                onClick={() => setShowEditsInfo(true)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-textMuted hover:border-neonViolet hover:text-white transition-all text-xs font-bold"
              >
                ?
              </button>
            </div>
          </div>
          <div className="mt-12 space-y-4"><PrimaryButton onClick={() => setStep(7)}>✅ Всё понятно</PrimaryButton><SecondaryButton onClick={() => setStep(5)}>Назад</SecondaryButton></div>
        </div>
      );
      
      if (step === 7) {
        const refs = booking.references_list.filter(r => r.url.trim() !== '');
        return (
          <div className="p-6 animate-ethereal-in">
            <ProgressBar current={7} total={7} />
            <Assistant message="Взгляни еще раз! Если всё верно — отправляем заявку 😍" avatarUrl={VSPYSHKA_AVATARS.winking} />
            
            <div className="glass p-8 rounded-[3.5rem] border-neonViolet/20 mt-10 space-y-8 text-sm relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neonViolet/5 blur-[60px] pointer-events-none"></div>
              
              <div className="space-y-2 border-b border-white/5 pb-6">
                <span className="text-textMuted uppercase text-[9px] font-black tracking-widest block opacity-50">Тариф и условия</span>
                <div className="flex justify-between items-baseline">
                  <span className="font-black text-xl text-white uppercase">{booking.tariff}</span>
                  <span className="text-neonCyan font-black text-lg">{selectedTariff?.price}</span>
                </div>
                <div className="text-[11px] text-textSecondary flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-neonPink mr-2"></span>
                  {selectedTariff?.photos} фото, {selectedTariff?.stylesLimit} образов
                </div>
              </div>

              <div className="space-y-4 border-b border-white/5 pb-6">
                <span className="text-textMuted uppercase text-[9px] font-black tracking-widest block opacity-50">Выбранные стили</span>
                <div className="space-y-1.5 pl-2">
                  {booking.styles.map((s, i) => (
                    <div key={i} className="flex items-center text-xs text-textSecondary">
                      <span className="text-neonViolet mr-3 font-bold opacity-60">{(i + 1).toString().padStart(2, '0')}</span>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {refs.length > 0 && (
                <div className="space-y-4 border-b border-white/5 pb-6">
                  <span className="text-textMuted uppercase text-[9px] font-black tracking-widest block opacity-50">Ваши референсы</span>
                  <div className="space-y-3 pl-2 max-h-40 overflow-y-auto no-scrollbar">
                    {refs.map((r, i) => (
                      <div key={i} className="text-[10px] leading-relaxed glass p-3 rounded-2xl border-white/5">
                        <div className="text-neonCyan truncate mb-1">🔗 {r.url}</div>
                        {r.comment && <div className="text-textMuted italic opacity-80">"{r.comment}"</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-5">
                <span className="text-textMuted uppercase text-[9px] font-black tracking-widest block opacity-50">Контактные данные</span>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-[8px] text-textMuted uppercase block mb-1">Имя</span>
                    <div className="font-bold text-white text-xs">{booking.userName || clientName}</div>
                  </div>
                  <div>
                    <span className="text-[8px] text-textMuted uppercase block mb-1">Telegram</span>
                    <div className="font-bold text-neonPink text-xs">{booking.telegramUsername}</div>
                  </div>
                  {booking.phone && (
                    <div className="col-span-2">
                      <span className="text-[8px] text-textMuted uppercase block mb-1">Телефон</span>
                      <div className="font-bold text-white text-xs">{booking.phone}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <PrimaryButton onClick={handleBookingSubmit} disabled={loading}>
                {loading ? 'Секунду, отправляю...' : '🚀 Всё верно, заказать!'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setStep(3)}>Изменить детали</SecondaryButton>
            </div>
          </div>
        );
      }
      
      return <div className="p-6 text-center py-40 opacity-30 text-[10px] uppercase tracking-widest">Загрузка...</div>;
    }

    if (branch === 'gift') {
      return (
        <div className="p-6 animate-ethereal-in">
          {step === 1 && (
            <>
              <Assistant message="Кому дарим сертификат? 🎁" avatarUrl={VSPYSHKA_AVATARS.happy} />
              <div className="space-y-8 mt-12"><Input label="Имя получателя" value={gift.recipientName} onChange={v => setGift({...gift, recipientName: v})} required /><Input label="Telegram получателя" value={gift.recipientTelegram} onChange={v => setGift({...gift, recipientTelegram: v})} /></div>
              <div className="mt-12 space-y-4"><PrimaryButton disabled={!gift.recipientName} onClick={() => setStep(2)}>Далее</PrimaryButton><SecondaryButton onClick={resetApp}>Назад</SecondaryButton></div>
            </>
          )}
          {step === 2 && (
            <>
              <Assistant message="Выбери номинал сертификата ✨" avatarUrl={VSPYSHKA_AVATARS.neutral} />
              <div className="space-y-4 mt-10">
                {TARIFFS.map(t => (
                  <Card key={t.type} selected={gift.tariff === t.type} onClick={() => setGift({...gift, tariff: t.type})}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-black text-lg uppercase italic tracking-tighter">{t.type}</span>
                      <span className="text-lg font-black text-neonCyan">{t.price}</span>
                    </div>
                    <div className="flex space-x-2 text-[10px] text-white/40 uppercase font-black tracking-tighter">
                       <span>📸 {t.photos} фото</span>
                       <span className="text-white/10">|</span>
                       <span>✨ {t.stylesLimit} образов</span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-12 space-y-4"><PrimaryButton disabled={!gift.tariff} onClick={() => setStep(3)}>Далее</PrimaryButton><SecondaryButton onClick={() => setStep(1)}>Назад</SecondaryButton></div>
            </>
          )}
          {step === 3 && (
            <>
              <Assistant message="Твои контакты для подтверждения 📞" avatarUrl={VSPYSHKA_AVATARS.happy} />
              <div className="mt-12 space-y-8"><Input label="Твой Telegram" value={gift.telegramUsername} onChange={v => setGift({...gift, telegramUsername: v})} required /></div>
              <div className="mt-12 space-y-4"><PrimaryButton disabled={!gift.telegramUsername || loading} onClick={handleGiftSubmit}>{loading ? 'Отправка...' : '🎁 Заказать'}</PrimaryButton><SecondaryButton onClick={() => setStep(2)}>Назад</SecondaryButton></div>
            </>
          )}
        </div>
      );
    }

    if (branch === 'question') return (
      <div className="p-6 animate-ethereal-in">
        <ProgressBar current={step} total={3} />
        {step === 1 && (
          <>
            <Assistant message="Как мне к тебе обращаться? ✨" avatarUrl={VSPYSHKA_AVATARS.neutral} />
            <div className="mt-12">
              <Input 
                label="Твоё имя" 
                value={question.userName || clientName} 
                onChange={v => setQuestion({...question, userName: v})} 
                required 
                placeholder="Например: Ольга" 
              />
            </div>
            <div className="mt-12 space-y-4">
              <PrimaryButton disabled={!question.userName && !clientName} onClick={() => setStep(2)}>Далее ✨</PrimaryButton>
              <SecondaryButton onClick={resetApp}>Назад</SecondaryButton>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <Assistant message="Оставь свой Telegram, чтобы Галина могла ответить тебе лично 💌" avatarUrl={VSPYSHKA_AVATARS.happy} />
            <div className="mt-12">
              <Input 
                label="Твой Telegram (@username)" 
                value={question.telegramUsername} 
                onChange={v => setQuestion({...question, telegramUsername: v})} 
                required 
                placeholder="@olga_dream" 
              />
            </div>
            <div className="mt-12 space-y-4">
              <PrimaryButton disabled={!question.telegramUsername} onClick={() => setStep(3)}>Далее ✨</PrimaryButton>
              <SecondaryButton onClick={() => setStep(1)}>Назад</SecondaryButton>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <Assistant message="Задай свой вопрос ✨ Я всё передам Галине!" avatarUrl={VSPYSHKA_AVATARS.thinking} />
            <div className="mt-12 space-y-8">
              <textarea 
                value={question.text} 
                onChange={e => setQuestion({...question, text: e.target.value})} 
                className="w-full h-44 glass rounded-[2.5rem] p-7 text-sm focus:outline-none focus:border-neonViolet/30 text-white/90" 
                placeholder="Твой вопрос..." 
              />
            </div>
            <div className="mt-12 space-y-4">
              <PrimaryButton disabled={!question.text || loading} onClick={handleQuestionSubmit}>
                {loading ? 'Отправка...' : 'Отправить вопрос 🚀'}
              </PrimaryButton>
              <SecondaryButton onClick={() => setStep(2)}>Назад</SecondaryButton>
            </div>
          </>
        )}
      </div>
    );

    return (
      <div className="p-6 h-screen flex flex-col justify-center text-center">
        <Assistant message="Ой, кажется я потерялась в облаках... Давай начнем сначала? ✨" avatarUrl={VSPYSHKA_AVATARS.thinking} side="center" />
        <PrimaryButton onClick={resetApp} className="mt-10">Начать сначала</PrimaryButton>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-white relative">
      <div className="max-w-lg mx-auto">
        {renderContent()}
      </div>
      {renderOverlays()}
    </div>
  );
};

export default App;
