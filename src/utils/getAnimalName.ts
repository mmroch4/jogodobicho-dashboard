const animals = [
  "Esquilo",
  "Polvo",
  "Formiga",
  "Baleia",
  "Cachorro",
  "Abelha",
  "Bode",
  "Carneiro",
  "Cobra",
  "Coelho",
  "Cavalo",
  "Elefante",
  "Galo",
  "Camelo",
  "Jacaré",
  "Golfinho",
  "Macaco",
  "Porco",
  "Pássaro",
  "Peru",
  "Touro",
  "Tigre",
  "Tartaruga",
  "Joaninha",
  "Vaca",
];

export const getAnimalName = (animal: number): string => {
  return animals[animal - 1];
};
