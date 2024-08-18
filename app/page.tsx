"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTheme } from 'next-themes'


interface VocabularyItem {
    word: string;
    description: string;
    references: string[];
    keywords: string[];
}


export default function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [vocabularyData, setVocabularyData] = useState<VocabularyItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { theme, setTheme } = useTheme()


    useEffect(() => {
        async function fetchVocabulary() {
            try {
                const response = await fetch('https://majvax.github.io/site-lilou/vocabulary.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch vocabulary data');
                }
                const data = await response.json() as VocabularyItem[];
                setVocabularyData(data.sort((a, b) => a.word.localCompare(b.word)););
            } catch (error) {
                console.error('Error fetching vocabulary:', error);
                // You might want to set some error state here
            } finally {
                setIsLoading(false);
            }
        }

        fetchVocabulary();
    }, []);


    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const filteredWords = vocabularyData.filter((item: VocabularyItem) =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openDialog = (word: VocabularyItem) => {
        setSelectedWord(word);
        setIsDialogOpen(true);
    };

    if (isLoading) {
        return <div className="min-h-screen p-8 bg-latte-base dark:bg-mocha-base text-latte-text dark:text-mocha-text flex items-center justify-center">
            <h1 className="text-4xl font-bold mb-8 text-latte-blue dark:text-mocha-blue">Chargements des données...</h1>
        </div>
    }

    return (
        <div className="min-h-screen p-8 bg-latte-base dark:bg-mocha-base text-latte-text dark:text-mocha-text">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-latte-blue dark:text-mocha-blue">Vocabulaire de Programmation</h1>

                <div className="mb-4 flex justify-between items-center">
                    <Input
                        type="text"
                        placeholder="Rechercher un mot..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 rounded bg-latte-surface0 dark:bg-mocha-surface0 text-latte-text dark:text-mocha-text border-latte-overlay0 dark:border-mocha-overlay0"
                    />
                    <Button onClick={toggleTheme} className="ml-4 bg-latte-lavender dark:bg-mocha-lavender text-latte-base dark:text-mocha-base">
                        {theme === 'light' ? 'Mode Sombre' : 'Mode Clair'}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredWords.map((item, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow duration-300 bg-latte-surface0 dark:bg-mocha-surface0 border-latte-overlay0 dark:border-mocha-overlay0" onClick={() => openDialog(item)}>
                            <CardHeader>
                                <CardTitle className="text-latte-text dark:text-mocha-text">{item.word}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-latte-subtext0 dark:text-mocha-subtext0">{item.keywords.join(', ')}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="bg-latte-surface0 dark:bg-mocha-surface0 text-latte-text dark:text-mocha-text border-latte-overlay0 dark:border-mocha-overlay0">
                        {selectedWord && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="text-latte-blue dark:text-mocha-blue">{selectedWord.word}</DialogTitle>
                                </DialogHeader>
                                <DialogDescription>
                                    <p className="mb-4">{selectedWord.description}</p>
                                    <h3 className="font-bold mb-2 text-latte-mauve dark:text-mocha-mauve">Références:</h3>
                                    <ul className="list-disc pl-5 mb-4">
                                        {selectedWord.references.map((ref, index) => (
                                            <li key={index}>
                                                <a href={ref} target="_blank" rel="noopener noreferrer" className="text-latte-blue dark:text-mocha-blue hover:underline">
                                                    Vidéo {index + 1}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </DialogDescription>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
