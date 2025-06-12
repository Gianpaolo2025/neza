
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, MessageSquare, Calendar, User, CheckCircle, X, Bookmark } from "lucide-react";

interface Suggestion {
  id: string;
  suggestion: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'implemented';
  userEmail: string;
  isBookmarked?: boolean;
}

export const UserSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [activeTab, setActiveTab] = useState<string>("todas");

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = () => {
    try {
      const storedSuggestions = JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]');
      const bookmarkedSuggestions = JSON.parse(localStorage.getItem('nezaBookmarkedSuggestions') || '[]');
      
      const suggestionsWithBookmarks = storedSuggestions.map((suggestion: Suggestion) => ({
        ...suggestion,
        isBookmarked: bookmarkedSuggestions.includes(suggestion.id)
      }));

      setSuggestions(suggestionsWithBookmarks.sort((a: Suggestion, b: Suggestion) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
    }
  };

  const toggleBookmark = (suggestionId: string) => {
    try {
      const bookmarkedSuggestions = JSON.parse(localStorage.getItem('nezaBookmarkedSuggestions') || '[]');
      let updatedBookmarks;

      if (bookmarkedSuggestions.includes(suggestionId)) {
        updatedBookmarks = bookmarkedSuggestions.filter((id: string) => id !== suggestionId);
      } else {
        updatedBookmarks = [...bookmarkedSuggestions, suggestionId];
      }

      localStorage.setItem('nezaBookmarkedSuggestions', JSON.stringify(updatedBookmarks));
      
      const updatedSuggestions = suggestions.map(suggestion =>
        suggestion.id === suggestionId 
          ? { ...suggestion, isBookmarked: !suggestion.isBookmarked }
          : suggestion
      );
      setSuggestions(updatedSuggestions);

      if (selectedSuggestion?.id === suggestionId) {
        setSelectedSuggestion({ ...selectedSuggestion, isBookmarked: !selectedSuggestion.isBookmarked });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const updateSuggestionStatus = (id: string, status: 'pending' | 'reviewed' | 'implemented') => {
    try {
      const updatedSuggestions = suggestions.map(suggestion =>
        suggestion.id === id ? { ...suggestion, status } : suggestion
      );
      setSuggestions(updatedSuggestions);
      
      const storedSuggestions = JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]');
      const updatedStoredSuggestions = storedSuggestions.map((suggestion: Suggestion) =>
        suggestion.id === id ? { ...suggestion, status } : suggestion
      );
      localStorage.setItem('nezaPlatformSuggestions', JSON.stringify(updatedStoredSuggestions));
      
      if (selectedSuggestion?.id === id) {
        setSelectedSuggestion({ ...selectedSuggestion, status });
      }
    } catch (error) {
      console.error('Error updating suggestion status:', error);
    }
  };

  const deleteSuggestion = (id: string) => {
    try {
      const updatedSuggestions = suggestions.filter(suggestion => suggestion.id !== id);
      setSuggestions(updatedSuggestions);
      
      const storedSuggestions = JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]');
      const updatedStoredSuggestions = storedSuggestions.filter((suggestion: Suggestion) => suggestion.id !== id);
      localStorage.setItem('nezaPlatformSuggestions', JSON.stringify(updatedStoredSuggestions));
      
      // Remove from bookmarks if it was bookmarked
      const bookmarkedSuggestions = JSON.parse(localStorage.getItem('nezaBookmarkedSuggestions') || '[]');
      const updatedBookmarks = bookmarkedSuggestions.filter((bookmarkId: string) => bookmarkId !== id);
      localStorage.setItem('nezaBookmarkedSuggestions', JSON.stringify(updatedBookmarks));
      
      if (selectedSuggestion?.id === id) {
        setSelectedSuggestion(null);
      }
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'implemented': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  const getFilteredSuggestions = () => {
    switch (activeTab) {
      case 'guardadas':
        return suggestions.filter(s => s.isBookmarked);
      default:
        return suggestions;
    }
  };

  const filteredSuggestions = getFilteredSuggestions();

  const renderSuggestionCard = (suggestion: Suggestion) => (
    <Card 
      key={suggestion.id}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedSuggestion?.id === suggestion.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedSuggestion(suggestion)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{suggestion.userEmail}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">{formatDate(suggestion.timestamp)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(suggestion.id);
              }}
              className="p-1 h-8 w-8"
            >
              <Bookmark 
                className={`w-4 h-4 ${
                  suggestion.isBookmarked 
                    ? 'fill-blue-500 text-blue-500' 
                    : 'text-gray-400 hover:text-blue-500'
                }`} 
              />
            </Button>
            <Badge className={getStatusColor(suggestion.status)}>
              {suggestion.status === 'pending' ? 'Pendiente' : 
               suggestion.status === 'reviewed' ? 'Revisada' : 'Implementada'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm line-clamp-3">
          {suggestion.suggestion}
        </p>
      </CardContent>
    </Card>
  );

  const renderDetailPanel = () => {
    if (!selectedSuggestion) return null;

    return (
      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Detalle de Sugerencia
            <Button
              size="sm"
              variant="ghost"
              onClick={() => toggleBookmark(selectedSuggestion.id)}
              className="ml-auto p-1 h-8 w-8"
            >
              <Bookmark 
                className={`w-4 h-4 ${
                  selectedSuggestion.isBookmarked 
                    ? 'fill-blue-500 text-blue-500' 
                    : 'text-gray-400 hover:text-blue-500'
                }`} 
              />
            </Button>
          </CardTitle>
          <CardDescription>
            Enviada el {formatDate(selectedSuggestion.timestamp)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Usuario:</label>
            <p className="text-gray-900">{selectedSuggestion.userEmail}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Sugerencia:</label>
            <Textarea
              value={selectedSuggestion.suggestion}
              readOnly
              className="mt-1 bg-gray-50"
              rows={6}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Estado:</label>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedSuggestion.status === 'pending' ? 'default' : 'outline'}
                onClick={() => updateSuggestionStatus(selectedSuggestion.id, 'pending')}
              >
                Pendiente
              </Button>
              <Button
                size="sm"
                variant={selectedSuggestion.status === 'reviewed' ? 'default' : 'outline'}
                onClick={() => updateSuggestionStatus(selectedSuggestion.id, 'reviewed')}
              >
                Revisada
              </Button>
              <Button
                size="sm"
                variant={selectedSuggestion.status === 'implemented' ? 'default' : 'outline'}
                onClick={() => updateSuggestionStatus(selectedSuggestion.id, 'implemented')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Implementada
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteSuggestion(selectedSuggestion.id)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar Sugerencia
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sugerencias de Usuarios</h2>
          <p className="text-gray-600">Gestiona las sugerencias recibidas de los usuarios</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {suggestions.length} sugerencias
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todas">Todas las Sugerencias</TabsTrigger>
          <TabsTrigger value="guardadas">
            Guardadas ({suggestions.filter(s => s.isBookmarked).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-6">
          {filteredSuggestions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sugerencias</h3>
                <p className="text-gray-500">Aún no se han recibido sugerencias de los usuarios.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                {filteredSuggestions.map(renderSuggestionCard)}
              </div>
              {renderDetailPanel()}
            </div>
          )}
        </TabsContent>

        <TabsContent value="guardadas" className="mt-6">
          {filteredSuggestions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sugerencias guardadas</h3>
                <p className="text-gray-500">Aún no has guardado ninguna sugerencia. Usa el ícono de marcador para guardar sugerencias importantes.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                {filteredSuggestions.map(renderSuggestionCard)}
              </div>
              {renderDetailPanel()}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
