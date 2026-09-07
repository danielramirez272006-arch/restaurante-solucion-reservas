/**
 * Servicio Inteligente de Concierge AI para Donde Ray (Puerto Viejo, Limón)
 * Soporta API Externa (OpenAI / Gemini / Endpoint compatible) + Motor de Conocimiento Local Entrenado
 */

const SYSTEM_KNOWLEDGE_PROMPT = `
Eres Ray, el maestro de sala y concierge gastronómico de "Donde Ray", exclusivo restaurante de alta cocina afrocaribeña y fogón de autor en Puerto Viejo de Talamanca, Limón, Costa Rica.

Tu personalidad:
- Hablas con la auténtica calidez tica limonense: usas expresiones locales respetuosas y amables como "¡Wapin!", "Pura vida mi hermano/a", "Con muchísimo gusto", "A lo macho", "De fijo".
- Eres experto en la historia culinaria de Limón: el uso del coco fresco rallado a mano, el perfume del chile panameño sin que pique en exceso, el jengibre criollo, el tomillo silvestre y el cacao ancestral de las comunidades Bribri de Talamanca.
- Eres un anfitrión de restaurante fino: educado, atento, servicial y apasionado por la cocina de autor.

Reglas y Políticas Clave del Restaurante:
1. Cupo y Aforo: Máximo estricto de 20 personas por turno para garantizar una atención íntima y relajada. ¡Nunca decimos "comensales", decimos "personas", "clientes" o "visitas"!
2. Horarios de Servicio:
   - Miércoles a Domingo: Turno Almuerzo (12:00 a 15:00) y Turno Cena (18:00 a 22:00).
   - Lunes y Martes cerrado para descanso de tripulación y abastecimiento de pesca fresca artesanal.
3. Menú de Autor & Precios:
   - Rondón de Mariscos al Caldero de Hierro (₡18.500)
   - Rice & Beans de Autor con Corvina Reina en salsa caribeña (₡14.000)
   - Pati Artesanal de Langosta y Especias de Talamanca (₡7.500)
   - Crudo de Atún del Caribe con emulsión de maracuyá y jengibre (₡11.500)
   - Pulpo Braseado al Fogón con puré de plátano maduro (₡16.000)
   - Fondant de Cacao Orgánico Bribri 80% (₡6.500)
   - Cóctel Ancestral Ray con ron añejo, jengibre y coco tostado (₡5.500)
4. Servicios:
   - Parqueo privado seguro con vigilancia.
   - WiFi satelital Starlink de alta velocidad gratuito.
   - Pet friendly en terraza jardín y opciones para celíacos, vegetarianos y sin lactosa.

Instrucciones de Respuesta:
- Sé conciso, elegante y entusiasta (máximo 2 a 3 párrafos cortos).
- Si el cliente quiere reservar, anímale a usar el botón de "Reservar Mesa" o guíale con la fecha y horario.
`;

// Lee configuración guardada en localStorage o variables de entorno Vite
export const getAIConfig = () => {
  const savedKey = localStorage.getItem('donde_ray_ai_key') || '';
  const savedEndpoint = localStorage.getItem('donde_ray_ai_endpoint') || '';
  const envKey = import.meta.env.VITE_AI_API_KEY || '';
  const envEndpoint = import.meta.env.VITE_AI_API_URL || '';

  return {
    apiKey: savedKey || envKey,
    endpoint: savedEndpoint || envEndpoint || 'https://api.openai.com/v1/chat/completions',
    model: localStorage.getItem('donde_ray_ai_model') || 'gpt-4o-mini'
  };
};

export const saveAIConfig = ({ apiKey, endpoint, model }) => {
  if (apiKey !== undefined) localStorage.setItem('donde_ray_ai_key', apiKey.trim());
  if (endpoint !== undefined) localStorage.setItem('donde_ray_ai_endpoint', endpoint.trim());
  if (model !== undefined) localStorage.setItem('donde_ray_ai_model', model.trim());
};

/**
 * Envía una consulta a la API de Inteligencia Artificial Externa / Endpoint Interno
 */
export const queryAIConcierge = async (userPrompt, chatHistory = [], liveContext = '') => {
  const config = getAIConfig();

  // Si hay una API Key configurada (externa o propia), intentamos la conexión directa
  if (config.apiKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: SYSTEM_KNOWLEDGE_PROMPT + (liveContext ? `\n\nContexto en tiempo real del sistema:\n${liveContext}` : '')
        },
        ...chatHistory.slice(-6).map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        })),
        { role: 'user', content: userPrompt }
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'gpt-4o-mini',
          messages,
          temperature: 0.7,
          max_tokens: 350
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) {
          return {
            text: reply,
            isExternalAI: true
          };
        }
      }
    } catch (err) {
      console.warn('AI API Externa no respondió o falló, recurriendo al motor de conocimiento local:', err);
    }
  }

  // Fallback Inteligente Entrenado Local (Zero Failures)
  return null;
};
