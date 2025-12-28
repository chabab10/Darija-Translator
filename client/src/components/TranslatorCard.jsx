import React, { useRef } from "react";
import { Card, CardContent, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function TranslatorCard({
  text,
  setText,
  translation,
  translateBrief,
  translateDetailed,
  loading,
  activeMode,
  history = []
}) {
  const historyRef = useRef(null); // ref pour la section historique

  const scrollToHistory = () => {
    if (historyRef.current) {
      historyRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {/* Carte principale */}
      <Card className="w-[700px] shadow-xl rounded-2xl">
        <CardContent>
          <Typography variant="h4" className="text-center font-bold mb-5">
            English → Darija Translator
          </Typography>

          <TextField
            label="Enter English text"
            multiline
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            variant="outlined"
          />

          <div className="flex justify-center mt-5 space-x-4">
            <Button
              variant="contained"
              size="large"
              onClick={translateBrief}
              disabled={loading || activeMode === "brief"}
              className={`!bg-blue-600 hover:!bg-blue-700 ${activeMode === "brief" ? "opacity-70" : ""}`}
            >
              {loading && activeMode === "brief" ? "Translating..." : "Translate (Brief)"}
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={translateDetailed}
              disabled={loading || activeMode === "detailed"}
              className={`!bg-green-600 hover:!bg-green-700 ${activeMode === "detailed" ? "opacity-70" : ""}`}
            >
              {loading && activeMode === "detailed" ? "Translating..." : "Translate (Detailed)"}
            </Button>

            <Button
              variant="contained"
              size="large"
              onClick={scrollToHistory}
              className="!bg-gray-500 hover:!bg-gray-600"
            >
              History
            </Button>
          </div>

          <Typography variant="h5" className="mt-8 font-semibold">
            Translation (Darija):
          </Typography>

          <div className="mt-3 bg-gray-100 p-4 rounded-lg min-h-[100px] whitespace-pre-wrap">
            {translation || "Your translation will appear here"}
          </div>
        </CardContent>
      </Card>

      {/* Historique affiché sous la carte */}
      <Card ref={historyRef} className="w-[700px] shadow-lg rounded-xl mt-6 bg-gray-50">
        <CardContent>
          <Typography variant="h6" className="font-semibold mb-3">
            Historique des traductions
          </Typography>
          {history.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Aucune traduction pour le moment.
            </Typography>
          ) : (
            <List>
              {history.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`[${item.mode}] ${item.original} → ${item.translated}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
