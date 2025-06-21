
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MessageSquare, Calendar, User, CheckCircle, X } from "lucide-react";

interface Suggestion {
  id: string;
  suggestion: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'implemented';
  userEmail: string;
}

export const UserSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, []);

  const loadSuggestions = () => {
    const storedSuggestions = JSON.parse(localStorage.getItem('nezaPlatformSuggestions') || '[]');
    setSuggestions(storedSuggestions.sort((a: Suggestion, b: Suggestion) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ));
  };

  const updateSuggestionStatus = (id: string, status: 'pending' | 'reviewed' | 'implemented') => {
    const updatedSuggestions = suggestions.map(suggestion =>
      suggestion.id === id ? { ...suggestion, status } : suggestion
    );
    setSuggestions(updatedSuggestions);
    localStorage.setItem('nezaPlatformSuggestions', JSON.stringify(updatedSuggestions));
  };

  const deleteSuggestion = (id: string) => {
    const updatedSuggestions = suggestions.filter(suggestion => suggestion.id !== id);
    setSuggestions(updatedSuggestions);
    localStorage.setItem('nezaPlatformSuggestions', JSON.stringify(updatedSuggestions));
    if (selectedSuggestion?.id === id) {
      setSelectedSuggestion(null);
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
    return new Date(timestamp).toLocaleString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

      {suggestions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay sugerencias</h3>
            <p className="text-gray-500">Aún no se han recibido sugerencias de los usuarios.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lista de sugerencias */}
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
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
                    <Badge className={getStatusColor(suggestion.status)}>
                      {suggestion.status === 'pending' ? 'Pendiente' : 
                       suggestion.status === 'reviewed' ? 'Revisada' : 'Implementada'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {suggestion.suggestion}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detalle de sugerencia seleccionada */}
          {selectedSuggestion && (
            <Card className="lg:sticky lg:top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Detalle de Sugerencia
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
          )}
        </div>
      )}
    </div>
  );
};
