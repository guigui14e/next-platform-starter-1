"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Vehicle {
    id: number;
    name: string;
    brand: string;
    image: string | null;
    achat: number | null;
    type: string | null;
    inStock?: boolean;
}

interface StockVehicle {
    voiture: string;
}

interface VehiclesApiResponse {
    data?: StockVehicle[];
    vehicles?: StockVehicle[];
}

interface Brand {
    id: number;
    nom: string;
}

const VehiclesPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [types, setTypes] = useState<string[]>(["Tous les types"]);
    const [selectedBrand, setSelectedBrand] = useState<string>("Toutes les marques");
    const [selectedType, setSelectedType] = useState<string>("Tous les types");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState<number>(1);
    const vehiclesPerPage = 12;

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const importsResponse = await fetch("/catalogue/api/imports");
                const importsVehicles = await importsResponse.json();

                const vehiclesResponse = await fetch("/catalogue/api/vehicles");
                const stockVehiclesResponse = (await vehiclesResponse.json()) as VehiclesApiResponse;

                let stockVehicles: StockVehicle[] =
                    stockVehiclesResponse.data || stockVehiclesResponse.vehicles || [];

                if (!Array.isArray(stockVehicles)) {
                    console.error("Erreur : La réponse de l'API vehicles ne contient ni 'data' ni 'vehicles'.", stockVehiclesResponse);
                    stockVehicles = [];
                }

                const vehiclesWithStock: Vehicle[] = importsVehicles.map((vehicle: Vehicle) => ({
                    ...vehicle,
                    inStock: stockVehicles.some(
                        (stockVehicle) =>
                            stockVehicle.voiture?.toLowerCase() === vehicle.name.toLowerCase()
                    ),
                }));

                const uniqueTypes: string[] = [
                    "Tous les types",
                    ...Array.from(
                        new Set(
                            vehiclesWithStock.map((vehicle: Vehicle) =>
                                typeof vehicle.type === "string" ? vehicle.type : ""
                            )
                        )
                    ),
                ];

                setTypes(uniqueTypes);
                setVehicles(vehiclesWithStock);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des données :", error);
            }
        };

        const fetchBrands = async () => {
            try {
                const response = await fetch("/catalogue/api/brands");
                const data = await response.json();
                setBrands([{ id: 0, nom: "Toutes les marques" }, ...data]);
            } catch (error) {
                console.error("❌ Erreur lors de la récupération des marques :", error);
            }
        };

        fetchVehicles();
        fetchBrands();
    }, []);

    useEffect(() => {
        let filtered = vehicles;

        if (selectedBrand !== "Toutes les marques") {
            filtered = filtered.filter((vehicle) => vehicle.brand === selectedBrand);
        }

        if (selectedType !== "Tous les types") {
            filtered = filtered.filter((vehicle) => vehicle.type === selectedType);
        }

        if (searchQuery) {
            filtered = filtered.filter((vehicle) =>
                vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredVehicles(filtered);
        setCurrentPage(1);
    }, [selectedBrand, selectedType, searchQuery, vehicles]);

    const indexOfLastVehicle = currentPage * vehiclesPerPage;
    const indexOfFirstVehicle = indexOfLastVehicle - vehiclesPerPage;
    const currentVehicles = filteredVehicles.slice(indexOfFirstVehicle, indexOfLastVehicle);
    const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);

    return (
        <div translate="no" className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 pt-48">
            <div className="container mx-auto px-6">
                
                {/* Titre de la page */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Registre des Véhicules
                    </h1>
                    <p className="text-gray-400 text-xl">
                        Explorez notre collection de véhicules disponibles
                    </p>
                </div>

                {/* Barre de contrôles */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Barre de recherche principale */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Rechercher un véhicule..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Compteur et mode d'affichage */}
                        <div className="flex items-center gap-4">
                            <span className="text-gray-300 text-sm bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700/30">
                                {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''}
                            </span>
                            
                            <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/30">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-white'}`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filtres horizontaux */}
                    <div className="flex flex-wrap gap-4 mt-6">
                        <div className="flex-1 min-w-[250px]">
                            <select
                                value={selectedBrand}
                                onChange={(e) => setSelectedBrand(e.target.value)}
                                className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            >
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.nom} className="bg-gray-800">
                                        {brand.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 min-w-[250px]">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                            >
                                {types.map((type) => (
                                    <option key={type} value={type} className="bg-gray-800">
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                {currentVehicles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-500 text-8xl mb-6">🚗</div>
                        <h3 className="text-2xl font-semibold text-gray-300 mb-3">Aucun véhicule trouvé</h3>
                        <p className="text-gray-500 text-lg">Essayez de modifier vos critères de recherche</p>
                    </div>
                ) : (
                    <>
                        {/* Vue grille */}
                        {viewMode === 'grid' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {currentVehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="group bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30"
                                    >
                                        <div className="relative h-56 overflow-hidden cursor-pointer" onClick={() => setSelectedImage(vehicle.image || "/images/default-car.jpg")}>
                                            <Image
                                                src={vehicle.image || "/images/default-car.jpg"}
                                                alt={vehicle.name || "Image indisponible"}
                                                width={400}
                                                height={224}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                                            {vehicle.inStock && (
                                                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg animate-pulse">
                                                    En stock
                                                </span>
                                            )}
                                            {/* Icône pour indiquer qu'on peut cliquer */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="bg-black/50 rounded-full p-3">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                {vehicle.name || "Nom inconnu"}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-3">{vehicle.brand}</p>
                                            {vehicle.type && (
                                                <span className="inline-block px-3 py-1 bg-gray-700/60 text-gray-300 text-xs rounded-lg border border-gray-600/30">
                                                    {vehicle.type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Vue liste */}
                        {viewMode === 'list' && (
                            <div className="space-y-6">
                                {currentVehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        className="group bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:border-blue-500/30"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => setSelectedImage(vehicle.image || "/images/default-car.jpg")}>
                                                <Image
                                                    src={vehicle.image || "/images/default-car.jpg"}
                                                    alt={vehicle.name || "Image indisponible"}
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                {vehicle.inStock && (
                                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold animate-pulse">
                                                        Stock
                                                    </span>
                                                )}
                                                {/* Icône de zoom */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="bg-black/50 rounded-full p-2">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                                                    {vehicle.name || "Nom inconnu"}
                                                </h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-400 text-lg">{vehicle.brand}</span>
                                                    {vehicle.type && (
                                                        <>
                                                            <span className="text-gray-600">•</span>
                                                            <span className="px-3 py-1 bg-gray-700/60 text-gray-300 text-sm rounded-lg border border-gray-600/30">
                                                                {vehicle.type}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center mt-16 gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                        currentPage === 1 
                                            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/30" 
                                            : "bg-gray-700/80 text-white hover:bg-blue-600 hover:shadow-lg border border-gray-600/50 hover:border-blue-500/50"
                                    }`}
                                >
                                    Précédent
                                </button>

                                <div className="flex gap-2 mx-4">
                                    {Array.from({ length: Math.min(7, totalPages) }, (_, index) => {
                                        let pageNum;
                                        if (totalPages <= 7) {
                                            pageNum = index + 1;
                                        } else if (currentPage <= 4) {
                                            pageNum = index + 1;
                                        } else if (currentPage >= totalPages - 3) {
                                            pageNum = totalPages - 6 + index;
                                        } else {
                                            pageNum = currentPage - 3 + index;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-12 h-12 rounded-xl font-semibold transition-all border ${
                                                    pageNum === currentPage
                                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-500"
                                                        : "bg-gray-700/80 text-gray-300 hover:bg-gray-600 hover:text-white border-gray-600/50 hover:border-gray-500"
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                                        currentPage === totalPages
                                            ? "bg-gray-700/50 text-gray-500 cursor-not-allowed border border-gray-600/30"
                                            : "bg-gray-700/80 text-white hover:bg-blue-600 hover:shadow-lg border border-gray-600/50 hover:border-blue-500/50"
                                    }`}
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal d'image en grand */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-5xl max-h-full">
                        <Image
                            src={selectedImage}
                            alt="Véhicule en grand"
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                        />
                        <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                            Cliquez n&apos;importe où pour fermer
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehiclesPage;