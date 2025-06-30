import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/Layout/PageHeader';
import { ArrowLeft, Calendar, Clock, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import TrainingEditModal from '../components/UI/TrainingEditModal';

interface TrainingItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  description: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'rest';
}

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<TrainingItem | null>(null);
  const [trainingAgenda, setTrainingAgenda] = useState<TrainingItem[]>([
    {
      id: '1',
      title: 'Morning Cardio',
      time: '07:00 AM',
      duration: '30 min',
      description: 'Light jogging or cycling to warm up the cardiovascular system. Focus on maintaining a steady heart rate between 120-140 bpm. This session helps improve endurance and prepares your body for more intensive training later.',
      type: 'cardio'
    },
    {
      id: '2',
      title: 'Strength Training',
      time: '10:00 AM',
      duration: '45 min',
      description: 'Upper body strength workout focusing on compound movements. Include bench press, pull-ups, shoulder press, and rows. 3 sets of 8-12 reps for each exercise. Rest 60-90 seconds between sets.',
      type: 'strength'
    },
    {
      id: '3',
      title: 'Lunch Break',
      time: '12:30 PM',
      duration: '60 min',
      description: 'Proper nutrition and recovery time. Focus on consuming lean proteins, complex carbohydrates, and plenty of water. This is crucial for muscle recovery and energy replenishment.',
      type: 'rest'
    },
    {
      id: '4',
      title: 'Technical Skills',
      time: '03:00 PM',
      duration: '90 min',
      description: 'Sport-specific skill development and tactical training. Work on technique refinement, strategy implementation, and position-specific drills. Focus on quality over quantity.',
      type: 'strength'
    },
    {
      id: '5',
      title: 'Cool Down & Stretching',
      time: '05:00 PM',
      duration: '20 min',
      description: 'Full body stretching routine to improve flexibility and prevent injury. Hold each stretch for 30 seconds. Focus on major muscle groups used during training.',
      type: 'flexibility'
    }
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cardio': return 'bg-blue-100 text-blue-800';
      case 'strength': return 'bg-red-100 text-red-800';
      case 'flexibility': return 'bg-green-100 text-green-800';
      case 'rest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleEdit = (item: TrainingItem) => {
    setEditingItem(item);
  };

  const handleSaveTraining = (updatedItem: TrainingItem) => {
    setTrainingAgenda(prev => 
      prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setEditingItem(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  return (
    <div 
      className="min-h-screen pb-24"
      style={{ 
        background: 'linear-gradient(to bottom, #3529cb, #800080)'
      }}
    >
      <div className="p-6">
        {/* Page Header with Logo */}
        <PageHeader />

        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-2xl font-bold text-white ml-4">Training Agenda</h1>
        </div>

        {/* Date Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 mb-6">
          <div className="flex items-center justify-center">
            <Calendar className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
          </div>
        </div>

        {/* Training Schedule */}
        <div className="space-y-4">
          {trainingAgenda.map((item) => (
            <div
              key={item.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                onClick={() => toggleExpand(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-sm font-medium text-blue-600">{item.time}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.duration}</p>
                  </div>
                  <div className="ml-4">
                    {expandedItem === item.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
              
              {expandedItem === item.id && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Details:</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(item);
                        }}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{trainingAgenda.length}</p>
              <p className="text-sm text-gray-600">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {trainingAgenda.reduce((total, item) => {
                  const duration = parseInt(item.duration.split(' ')[0]);
                  return total + duration;
                }, 0)}m
              </p>
              <p className="text-sm text-gray-600">Total Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Training Edit Modal */}
      {editingItem && (
        <TrainingEditModal
          isOpen={!!editingItem}
          trainingItem={editingItem}
          onSave={handleSaveTraining}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
};

export default TrainingPage;