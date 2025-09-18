import { useState, useEffect } from 'react';
import { Clock, User, ChevronRight } from 'lucide-react';

interface AgendaItem {
  id: number;
  number: string;
  title: string;
  duration: string;
  sort_order: number;
}

export default function AgendaSlide() {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgenda = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/63d364f3-31f8-4442-8ce2-b8b806f75784');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAgendaItems(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
        console.error('Error fetching agenda:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgenda();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Загрузка повестки дня...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-red-300 text-xl">Ошибка: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent mb-6">
            Повестка дня
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Детальный план нашей презентации с временными рамками
          </p>
        </div>

        {/* Agenda Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid gap-6">
            {agendaItems.map((item, index) => (
              <div
                key={item.id}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold">
                      {item.number}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors">
                        {item.title}
                      </h3>
                      
                      <div className="flex items-center space-x-4 text-blue-200">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{item.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronRight className="w-6 h-6 text-blue-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-12 text-center">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 inline-block">
              <div className="flex items-center justify-center space-x-4">
                <Clock className="w-6 h-6 text-blue-300" />
                <span className="text-lg text-blue-200">
                  Общая продолжительность: <span className="text-white font-semibold">35 минут</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}