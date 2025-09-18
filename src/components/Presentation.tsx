import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import AgendaSlide from './AgendaSlide';

interface Slide {
  id: number;
  title: string;
  content: React.ReactNode;
}

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [presentationTitle, setPresentationTitle] = useState('Название презентации');
  const [presentationSubtitle, setPresentationSubtitle] = useState('Подзаголовок или краткое описание');

  const slides: Slide[] = [
    {
      id: 1,
      title: "Введение",
      content: (
        <div className="space-y-8 text-center">
          <h2 className="text-5xl font-light mb-8">{presentationTitle}</h2>
          <div className="space-y-4">
            <p className="text-xl text-gray-600">{presentationSubtitle}</p>
            <p className="text-lg text-gray-500">Автор • Дата</p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Содержание",
      content: <AgendaSlide />
    },
    {
      id: 3,
      title: "Основная часть",
      content: (
        <div className="space-y-8">
          <h2 className="text-4xl font-light text-center mb-12">Ключевая информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Lightbulb" size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-medium mb-4">Идея</h3>
                <p className="text-gray-600">Основная концепция и подход к решению задач</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Target" size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-medium mb-4">Цель</h3>
                <p className="text-gray-600">Желаемые результаты и ожидаемые достижения</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Cog" size={32} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-medium mb-4">Процесс</h3>
                <p className="text-gray-600">Этапы реализации и методология работы</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="TrendingUp" size={32} className="text-orange-600" />
                </div>
                <h3 className="text-xl font-medium mb-4">Результат</h3>
                <p className="text-gray-600">Измеримые показатели и достигнутые цели</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Выводы",
      content: (
        <div className="space-y-8 text-center">
          <h2 className="text-4xl font-light mb-12">Заключение</h2>
          <div className="space-y-6">
            <div className="text-left max-w-2xl mx-auto space-y-4">
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={24} className="text-green-600 mt-1" />
                <p className="text-lg">Основные задачи успешно решены</p>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={24} className="text-green-600 mt-1" />
                <p className="text-lg">Достигнуты поставленные цели</p>
              </div>
              <div className="flex items-start space-x-3">
                <Icon name="CheckCircle" size={24} className="text-green-600 mt-1" />
                <p className="text-lg">Определены дальнейшие шаги развития</p>
              </div>
            </div>
            <div className="mt-12 p-8 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-light mb-4">Спасибо за внимание!</h3>
              <p className="text-gray-600">Вопросы и обсуждение</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Fetch presentation title on page load
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/eaf50df9-841d-4ccb-9de0-fcba31a5a2c4');
        const data = await response.json();
        setPresentationTitle(data.title);
        setPresentationSubtitle(data.subtitle);
      } catch (error) {
        console.log('Используем дефолтное название');
      }
    };
    
    fetchTitle();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-medium">Презентация</h1>
              <span className="text-sm text-gray-500">
                {currentSlide + 1} из {slides.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-full">
            {slides[currentSlide].content}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-4 bg-white/95 backdrop-blur-sm border rounded-full px-6 py-3 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="rounded-full"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{slides[currentSlide].title}</span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="rounded-full"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400">
        <p>← → для навигации</p>
      </div>
    </div>
  );
};

export default Presentation;