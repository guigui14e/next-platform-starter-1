"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

// Types et interfaces (inchangés)
interface Brand {
  id: number;
  nom: string;
  image: string | null;
}

interface VehicleDetail {
  plaque: string;
  achats: number;
  vente: number;
  benef: number;
  acheteur: string;
  performance: string;
  categorie: string;
  date: string;
  image: string | null;
}

interface GroupedVehicle {
  voiture: string;
  brand: string;
  details: VehicleDetail[];
}

interface FilterSectionProps {
  brands: Brand[];
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface PerformanceBadgesProps {
  performance: string;
}

interface VehicleCardProps {
  vehicle: GroupedVehicle;
  currentIndex: number;
  handleIndexChange: (voiture: string, newIndex: number) => void;
  getCartesGrises: (performance: string) => string;
  getBarColor: (cartesGrises: string) => string;
  handleMouseEnter: (e: React.MouseEvent<HTMLDivElement>, voiture: string, detail: VehicleDetail) => void;
  handleMouseLeave: () => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onImageClick: (imageUrl: string) => void; // Nouvelle prop pour le clic d'image
}

// Composants modernisés
const HeroSection: React.FC = () => (
  <div className="relative pt-16 pb-12 px-4 flex flex-col items-center justify-center bg-black bg-opacity-40">
    <div className="absolute inset-0 z-0">
      <div className="w-full h-full bg-gradient-to-r from-black via-transparent to-black opacity-70"></div>
    </div>
    <div className="relative z-10 flex flex-col items-center">
      <Image
        src="https://i.ibb.co/Ss62f7m/continentalcar.png"
        alt="Continental Cars Hero"
        width={320}
        height={160}
        className="mb-8 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
      />
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500">
        Bienvenue chez Continental Cars
      </h1>
      <p className="text-gray-300 text-center max-w-9xl mb-8 text-lg">
        Découvrez notre collection exclusive de véhicules d&apos;exception (Catalogue mis à jour en temps réel avec la compta)
      </p>
    </div>
  </div>
);

interface FilterSectionProps {
  brands: Brand[];
  selectedMake: string;
  setSelectedMake: (make: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  selectedCarteGrise: string;
  setSelectedCarteGrise: (cg: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

// 2. Mettez à jour le composant FilterSection pour gérer la sélection de carte grise
const FilterSection: React.FC<FilterSectionProps> = ({
  brands,
  selectedMake,
  setSelectedMake,
  selectedModel,
  setSelectedModel,
  selectedCarteGrise,
  setSelectedCarteGrise,
  maxPrice,
  setMaxPrice,
  searchQuery,
  setSearchQuery
}) => (
  <div className="max-w-6xl mx-auto px-4 -mt-8 mb-16 relative z-20">
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl shadow-2xl p-8 border border-gray-800">
      {/* Barre de recherche modernisée avec la croix plus petite */}
      <div className="mb-8">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une marque, un modèle..."
            className="block w-full pr-12 py-4 border-0 rounded-l-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset transition-all duration-200 text-lg shadow-inner"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center justify-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mr-3 text-red-500">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filtres avancés
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Sélecteur de marque */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Marque</label>
          <div className="relative">
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="block w-full bg-gray-800 border-0 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none shadow-inner"
            >
              <option value="All Makes">Toutes les marques</option>
              {brands.filter(brand => brand.nom !== "All Makes").map((brand) => (
                <option key={brand.id} value={brand.nom}>
                  {brand.nom}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Sélecteur de performance */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Performance</label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="block w-full bg-gray-800 border-0 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none shadow-inner"
            >
              <option value="All Performances">Toutes les performances</option>
              <option value="Origine">Origine</option>
              <option value="Turbo">Turbo</option>
              <option value="Moteur">Moteur</option>
              <option value="Frein">Frein</option>
              <option value="Transmi">Transmi</option>
              <option value="Full Perf">Full Perf</option>
              <option value="Turbo Moteur">Turbo Moteur</option>
              <option value="Turbo Frein">Turbo Frein</option>
              <option value="Turbo Transmi">Turbo Transmi</option>
              <option value="Moteur Frein">Moteur Frein</option>
              <option value="Moteur Transmi">Moteur Transmi</option>
              <option value="Frein Transmi">Frein Transmi</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Nouveau sélecteur de carte grise - MAINTENANT FONCTIONNEL */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-2">Carte grise</label>
          <div className="relative">
            <select
              value={selectedCarteGrise}
              onChange={(e) => setSelectedCarteGrise(e.target.value)}
              className="block w-full bg-gray-800 border-0 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none shadow-inner"
            >
              <option value="All">Toutes</option>
              <option value="0">0 CG</option>
              <option value="1">1 CG</option>
              <option value="2">2 CG</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Filtre de prix (slider) */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">Plage de prix</label>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-gray-400">0 $</span>
              <span className="font-semibold text-white">Max: {maxPrice.toLocaleString('fr-FR')} $</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PerformanceBadges: React.FC<PerformanceBadgesProps> = ({ performance }) => {
  const renderPerfIcon = (perfType: string): React.ReactElement | null => {
    switch (perfType) {
      case 'Turbo':
        return <span className="text-sm">🚀</span>;
      case 'Moteur':
        return <span className="text-sm">⚙️</span>;
      case 'Frein':
        return <span className="text-sm">🛑</span>;
      case 'Transmi':
        return <span className="text-sm">⚡</span>;
      default:
        return null;
    }
  };

  if (performance.includes("Origine")) {
    return (
      <div className="bg-gray-700 px-3 py-1 rounded-full flex items-center">
        <span className="mr-1">🛠️</span>
        <span className="text-sm font-medium">Origine</span>
      </div>
    );
  }

  if (performance.includes("Full Perf")) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1 rounded-full flex items-center">
        <span className="mr-1">🔥</span>
        <span className="text-sm font-medium">Full Perf</span>
      </div>
    );
  }

  return (
    <>
      {["Turbo", "Transmi", "Moteur", "Frein"].map((perf) => (
        <div
          key={perf}
          className={`px-3 py-1 rounded-full flex items-center ${performance.includes(perf)
            ? "bg-gradient-to-r from-green-600 to-green-500"
            : "bg-gray-700 text-gray-400"
            }`}
        >
          {renderPerfIcon(perf)}
          <span className="text-xs font-medium ml-1">{perf}</span>
        </div>
      ))}
    </>
  );
};

// Modification du composant VehicleCard avec cadre d'image agrandi ET FONCTION DE CLIC
const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  currentIndex,
  handleIndexChange,
  getCartesGrises,
  getBarColor,
  handleMouseEnter,
  handleMouseLeave,
  handleMouseMove,
  onImageClick // Nouvelle prop
}) => {
  const { voiture, brand, details } = vehicle;
  const currentDetail = details[currentIndex];

  return (
    <div
      key={voiture}
      className="bg-gradient-to-b from-gray-800 to-gray-950 rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-900/20 transform hover:-translate-y-2 transition-all duration-300 border border-gray-800 hover:border-gray-700"
      onMouseEnter={(e) => handleMouseEnter(e, voiture, currentDetail)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Badge de marque */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full z-10 border border-gray-700">
        <span className="text-sm font-medium">{brand}</span>
      </div>

      {/* Image du véhicule - CLIQUABLE MAINTENANT */}
      <div 
        className="relative h-64 w-full overflow-hidden group cursor-pointer" 
        onClick={() => onImageClick(currentDetail.image || "/images/default-car.jpg")}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60 z-10"></div>
        <Image
          src={currentDetail.image || "/images/default-car.jpg"}
          alt={voiture}
          fill
          style={{
            objectFit: "cover",
            objectPosition: "center"
          }}
          className="transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Icône pour indiquer qu'on peut cliquer */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="bg-black/50 rounded-full p-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Cartes grises */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`px-3 py-1 rounded-full font-medium text-xs ${getBarColor(getCartesGrises(currentDetail.performance))} shadow-lg backdrop-blur-sm`}>
          {getCartesGrises(currentDetail.performance)} CG
        </div>
      </div>

      {/* Contenu - Légèrement réduit en hauteur (p-5 au lieu de p-6) pour compenser l'agrandissement de l'image */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-center">{voiture}</h3>

        {/* Performances */}
        <div className="flex justify-center flex-wrap gap-2 mt-3 mb-4">
          <PerformanceBadges performance={currentDetail.performance} />
        </div>

        {/* Prix avec effet de dégradé */}
        <div className="mt-4 text-center">
          <span className="text-gray-400 text-sm">Prix</span>
          <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            $ {Math.floor(currentDetail.vente || 0).toLocaleString("fr-FR").replace(/,/g, " ")}
          </p>
        </div>
      </div>

      {/* Navigation entre les variantes */}
      {details.length > 1 && (
        <div className="absolute bottom-4 right-4 flex justify-center">
          <button
            onClick={() =>
              handleIndexChange(
                voiture,
                (currentIndex + 1) % details.length
              )
            }
            className="bg-gradient-to-r from-red-600 to-red-500 rounded-full w-10 h-10 flex items-center justify-center hover:from-red-700 hover:to-red-600 transition-colors shadow-lg"
            title={`Variants: ${currentIndex + 1}/${details.length}`}
          >
            <span className="text-xs font-bold text-white">{currentIndex + 1}/{details.length}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Ajoutez cette fonction dans votre composant CataloguePage
const countTotalVehicles = (vehicles: GroupedVehicle[] | null): number => {
  if (!vehicles) return 0;

  return vehicles.reduce((total: number, vehicle: GroupedVehicle) => {
    return total + vehicle.details.length;
  }, 0);
};

// Utilitaires
const Utils = {
  // Remplacez cette fonction dans le Utils
  getCartesGrises: (performance: string): string => {
    const match = performance.match(/CG (\d+)\/(\d+)/);
    return match ? `${match[1]}/${match[2]}` : "0/0";
  },

  getBarColor: (cartesGrises: string): string => {
    const [valid, total] = cartesGrises.split("/").map(Number);
    if (valid / total >= 2 / 3) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (valid > 0) return "bg-gradient-to-r from-orange-500 to-amber-400";
    return "bg-gradient-to-r from-red-600 to-red-400";
  }
};

// Composant principal modernisé AVEC MODAL D'IMAGE
const CataloguePage: React.FC = () => {
  // États
  const [brands, setBrands] = useState<Brand[] | null>(null);
  const [vehicles, setVehicles] = useState<GroupedVehicle[] | null>(null);
  const [selectedMake, setSelectedMake] = useState<string>("All Makes");
  const [selectedModel, setSelectedModel] = useState<string>("All Performances");
  const [selectedCarteGrise, setSelectedCarteGrise] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [error, setError] = useState<string | null>(null);
  const [currentIndexes, setCurrentIndexes] = useState<{ [key: string]: number }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // NOUVEL ÉTAT POUR LE MODAL D'IMAGE
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handlers
  const handleIndexChange = (voiture: string, newIndex: number): void => {
    setCurrentIndexes((prev) => ({
      ...prev,
      [voiture]: newIndex,
    }));
  };

  const handleMouseEnter = (): void => {
    // Fonction vide pour éviter l'erreur de variable inutilisée
  };

  const handleMouseLeave = (): void => {
    // Fonction vide pour éviter l'erreur de variable inutilisée
  };

  const handleMouseMove = (): void => {
    // Fonction vide pour éviter l'erreur de variable inutilisée
  };

  // NOUVEAU HANDLER POUR LE CLIC D'IMAGE
  const handleImageClick = (imageUrl: string): void => {
    setSelectedImage(imageUrl);
  };

  // Effets
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const apiUrl = "/catalogue/api/vehicles";
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Erreur HTTP : ${response.status}`);
        }

        const data: { brands: Brand[]; vehicles: GroupedVehicle[] } = await response.json();
        setBrands([{ id: 0, nom: "All Makes", image: null }, ...data.brands]);
        setVehicles(data.vehicles || []);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Erreur lors de la récupération des données :", err.message);
          setError(err.message);
        } else {
          console.error("Erreur inconnue :", err);
          setError("Une erreur inconnue est survenue.");
        }
      }
    };

    fetchData();
  }, []);

  // Filtrage des véhicules
  const filteredVehicles = vehicles?.filter((v) => {
    const cleanPerformance = (performance: string): string => {
      return performance.replace(/CG \d+\/\d+$/, "").trim();
    };

    const matchesCarteGrise = (detail: VehicleDetail): boolean => {
      if (selectedCarteGrise === "All") return true;

      const match = detail.performance.match(/CG (\d+)\/(\d+)/);
      if (!match) return false;

      const valid = match[1];

      return valid === selectedCarteGrise;
    };

    const matchesSearch = !searchQuery || searchQuery.trim() === "" ||
      (v.voiture && v.voiture.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (v.brand && v.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    const isDefaultFilter =
      selectedMake === "All Makes" &&
      selectedModel === "All Performances" &&
      selectedCarteGrise === "All" &&
      maxPrice === 1000000 &&
      (!searchQuery || searchQuery.trim() === "");

    if (isDefaultFilter) return true;

    return (
      matchesSearch &&
      (selectedMake === "All Makes" || v.brand === selectedMake) &&
      (selectedModel === "All Performances" ||
        v.details.some((d) => cleanPerformance(d.performance) === selectedModel)) &&
      v.details.some((d) =>
        d.vente <= maxPrice &&
        matchesCarteGrise(d)
      )
    );
  });

  // Gestion des erreurs et chargement
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="bg-red-900/20 border-l-4 border-red-500 text-red-100 p-6 rounded-lg shadow-lg max-w-md">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-red-500 mr-3">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p className="font-bold text-lg">Erreur</p>
          </div>
          <p>{error}</p>
          <button className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!brands || !vehicles) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-red-600 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300">Chargement de votre collection...</p>
        </div>
      </div>
    );
  }

  // Rendu principal
  return (
    <div translate="no" className="bg-gradient-to-b from-gray-950 via-black to-gray-950 min-h-screen text-white mt-[90px]">
      <HeroSection />
      <FilterSection
        brands={brands}
        selectedMake={selectedMake}
        setSelectedMake={setSelectedMake}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedCarteGrise={selectedCarteGrise}
        setSelectedCarteGrise={setSelectedCarteGrise}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="max-w-full mx-auto px-8 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white text-center bold">
          </h2>

          {filteredVehicles && (
            <div className="bg-gray-800 px-4 py-2 rounded-full">
              <span className="text-gray-400 mr-2">Résultats:</span>
              <span className="text-white font-bold">{countTotalVehicles(filteredVehicles)}</span>
            </div>
          )}
        </div>

        {filteredVehicles && filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.voiture}
                vehicle={vehicle}
                currentIndex={currentIndexes[vehicle.voiture] || 0}
                handleIndexChange={handleIndexChange}
                getCartesGrises={Utils.getCartesGrises}
                getBarColor={Utils.getBarColor}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                handleMouseMove={handleMouseMove}
                onImageClick={handleImageClick} // Nouvelle prop passée
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Aucun véhicule ne correspond à vos critères de recherche. Essayez d&apos;ajuster vos filtres.
            </p>
            <button
              onClick={() => {
                setSelectedMake("All Makes");
                setSelectedModel("All Performances");
                setSelectedCarteGrise("All");
                setMaxPrice(1000000);
                setSearchQuery("");
              }}
              className="mt-6 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* MODAL D'IMAGE EN GRAND - NOUVEAU */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl max-h-full">
            <Image
              src={selectedImage}
              alt="Véhicule en grand"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
              Cliquez à côté de l&apos;image pour fermer
            </div>
          </div>
        </div>
      )}

      {/* Bouton pour remonter en haut de page */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50 transition-all hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default CataloguePage;