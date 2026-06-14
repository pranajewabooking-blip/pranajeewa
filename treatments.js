// Treatment Data Array - Updated with Duration, Price, Suitability and Process
const treatments = [
    {
        id: 1,
        name: "Panchakarma Therapy",
        category: "clinic",
        duration: "90 Mins",
        price: "Rs. 7,500",
        description: "A comprehensive Ayurvedic detoxification treatment that cleanses the body of toxins and balances the three doshas. This ancient therapy includes five therapeutic procedures to rejuvenate the body and mind.",
        features: [
            "Complete body detoxification",
            "Balances Vata, Pitta, and Kapha",
            "Improves digestion and metabolism",
            "Enhances mental clarity",
            "Boosts immunity naturally"
        ],
        suitability: "Ideal for chronic fatigue, digestive disorders, stress accumulation, and full-body rejuvenation.",
        process: "Ayurvedic Consultation ➔ Deep Oil Massage (Oleation) ➔ Herbal Steam (Fomentation) ➔ Toxin Elimination.",
        image: "https://media.istockphoto.com/id/491683745/photo/woman-having-massage-with-pouch.jpg?s=612x612&w=0&k=20&c=jS4YdtNA9ukNgE0f1euMd8GiMgrfYQ1i9KVMSfVhKJQ="
    },
    {
        id: 2,
        name: "Abhyanga Massage",
        category: "wellness treatment",
        duration: "60 Mins",
        price: "Rs. 5,000",
        description: "Traditional warm oil massage therapy that nourishes the body and promotes deep relaxation. Uses specially prepared herbal oils to improve circulation and remove stress.",
        features: [
            "Full body warm oil massage",
            "Reduces stress and anxiety",
            "Improves skin complexion",
            "Enhances lymphatic drainage",
            "Promotes deep sleep"
        ],
        suitability: "Recommended for high stress, muscle stiffness, insomnia, and dry skin conditions.",
        process: "Herbal Oil Selection ➔ Synchronized Full Body Massage ➔ Warm Towel Wipe / Steam.",
        image: "https://t3.ftcdn.net/jpg/03/13/48/62/360_F_313486237_BNZ3rjW4LQtQSPn4OpZZIGfHiOedgPGi.jpg"
    },
    {
        id: 3,
        name: "Sports Injury Rehabilitation",
        category: "sport massage therapy",
        duration: "75 Mins",
        price: "Rs. 6,500",
        description: "Specialized massage therapy for athletes and sports injury recovery. Combines deep tissue techniques with Ayurvedic oils to accelerate healing and restore mobility.",
        features: [
            "Targeted muscle tension relief",
            "Accelerated injury recovery",
            "Improved flexibility",
            "Reduced inflammation",
            "Enhanced performance"
        ],
        suitability: "Perfect for athletes, gym-goers, individuals recovering from muscle sprains, or joint stiffness.",
        process: "Injury Assessment ➔ Target Specific Herbal Oil Therapy ➔ Controlled Deep Stretching.",
        image: "https://greatermanchester.ac.uk//assets/Uploads/What-is-Sports-Rehabilitation-University-of-Bolton.jpg"
    },
    {
        id: 4,
        name: "Herbal Facial Treatment",
        category: "beauty treatment",
        duration: "45 Mins",
        price: "Rs. 3,500",
        description: "Natural facial therapy using organic herbs and plant extracts. Revitalizes skin, reduces wrinkles, and brings out your natural glow without harmful chemicals.",
        features: [
            "Organic herbal ingredients",
            "Reduces signs of aging",
            "Even skin tone",
            "Deep pore cleansing",
            "Natural radiance boost"
        ],
        suitability: "Suitable for dull skin, acne scars, uneven skin pigmentation, and general facial care.",
        process: "Natural Cleansing ➔ Gentle Herbal Scrub ➔ Steaming ➔ Nourishing Ayurvedic Face Pack.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtYLLiCBEXolbopgF0Ihd2MHhih0gAx__i9Yi2aIQ1WNdBEb_rv95i1dc&s=10"
    },
    {
        id: 5,
        name: "Shirodhara",
        category: "wellness treatment",
        duration: "60 Mins",
        price: "Rs. 8,000",
        description: "Continuous pouring of warm herbal oil on the forehead to balance the nervous system. Known for treating stress, anxiety, and improving cognitive function.",
        features: [
            "Mental relaxation and calm",
            "Reduces anxiety and stress",
            "Improves memory and focus",
            "Better sleep quality",
            "Nervous system balance"
        ],
        suitability: "Highly effective for severe headaches, migraines, high anxiety, and chronic sleep disorders.",
        process: "Head Massage ➔ Continuous Warm Oil Rhythmic Pouring ➔ Gentle Relaxation Rest.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzbroGWirmnKo-Wa1aelrZvXYGBvQcBYTimZegrNzC7-i35xOMAsy-XJEN&s=10"
    },
    {
        id: 6,
        name: "Deep Tissue Sports Massage",
        category: "sport massage therapy",
        duration: "60 Mins",
        price: "Rs. 5,500",
        description: "Intensive massage therapy focusing on deeper muscle layers. Perfect for chronic pain relief and sports-related muscle tension.",
        features: [
            "Breaks down scar tissue",
            "Relieves chronic muscle tension",
            "Improves range of motion",
            "Prevents injury recurrence",
            "Enhances muscle recovery"
        ],
        suitability: "Designed for individuals dealing with chronic back pain, stiff neck, or deep muscle knots.",
        process: "Tension Zone Identification ➔ Firm Deep Tissue Pressures ➔ Specialized Oil Treatment.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1cXe7bR8ZjGQZcXfeLdNCZ1CP4VBgYrE18M5aTOx2MOz5r-dxByKeLro&s=10"
    },
    {
        id: 7,
        name: "Herbal Body Wrap",
        category: "beauty treatment",
        duration: "75 Mins",
        price: "Rs. 6,000",
        description: "Detoxifying body wrap using natural herbs and clay. Removes toxins, hydrates skin, and promotes weight management naturally.",
        features: [
            "Full body detoxification",
            "Skin hydration and nourishment",
            "Temporary inch loss",
            "Mineral rich formulation",
            "Relaxing experience"
        ],
        suitability: "Great for body skin exfoliation, cellulites reduction, and natural skin hydration.",
        process: "Full Body Herbal Scrub ➔ Medicated Paste Application ➔ Eco Wrap ➔ Warm Shower.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_lgPFe43kayX24nViihA80CUST8kLw5rfJfIZg55XOQ&s=10"
    },
    {
        id: 8,
        name: "Consultation & Diagnosis",
        category: "clinic",
        duration: "30 Mins",
        price: "Rs. 1,500",
        description: "Personalized Ayurvedic consultation with expert physicians. Includes pulse diagnosis, dosha analysis, and customized treatment recommendations.",
        features: [
            "Complete dosha analysis",
            "Personalized treatment plan",
            "Pulse diagnosis method",
            "Dietary recommendations",
            "Lifestyle modifications"
        ],
        suitability: "Essential for anyone starting their healing journey or seeking organic medical advice.",
        process: "Nadi Pariksha (Pulse Reading) ➔ History Review ➔ Lifestyle & Diet Plan Creation.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ788oxnc-xSjmybR5oUmGS6dEsgmRzsZwRwtkhLH7b_A&s=10"
    }
];

// Function to get all treatments
function getAllTreatments() {
    return treatments;
}

// Function to get treatment by ID
function getTreatmentById(id) {
    return treatments.find(treatment => treatment.id === id);
}

// Function to get treatments by category
function getTreatmentsByCategory(category) {
    if (category === 'all') return treatments;
    return treatments.filter(treatment => treatment.category === category);
}

// Renamed to avoid overlap/conflict with script.js search function
function getTreatmentsBySearch(searchTerm) {
    const term = searchTerm.toLowerCase();
    return treatments.filter(treatment => 
        treatment.name.toLowerCase().includes(term) ||
        treatment.description.toLowerCase().includes(term) ||
        treatment.category.toLowerCase().includes(term)
    );
}

// Function to add new treatment
function addTreatment(treatment) {
    const newId = treatments.length > 0 ? Math.max(...treatments.map(t => t.id)) + 1 : 1;
    treatments.push({ id: newId, ...treatment });
}

// Function to update treatment
function updateTreatment(id, updatedTreatment) {
    const index = treatments.findIndex(treatment => treatment.id === id);
    if (index !== -1) {
        treatments[index] = { id, ...updatedTreatment };
    }
}

// Function to delete treatment
function deleteTreatment(id) {
    const index = treatments.findIndex(treatment => treatment.id === id);
    if (index !== -1) {
        treatments.splice(index, 1);
    }
}