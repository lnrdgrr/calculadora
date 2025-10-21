document.getElementById('calculatorForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get input values
    let videoDuration = parseFloat(document.getElementById('videoDuration').value);
    let numVideos = parseFloat(document.getElementById('numVideos').value);
    let videoType = document.getElementById('videoType').value;
    let complexity = document.getElementById('complexity').value;
    let clientBaseFee = document.getElementById('clientBaseFee').value;
    
    // Team and studio rates
    const hourlyRates = {
        "motionDesigner": 40.625,
        "editor": 40.625,
        "coordinator": 75,
        "cinematographer": 50,
        "designer": 43.75,
        "studio": 1500
    };
    
    const editingTime = {
        "low": 6,
        "medium": 8,
        "high": 12
    };
    
    // Functions to calculate studio time and editing time
    function calculateStudioCost(videoDuration) {
        const studioHoursRequired = Math.ceil((videoDuration / 4) * 2); // 2 hours of recording per 1 hour of material
        return studioHoursRequired * hourlyRates.studio;
    }
    
    function calculateEditingTime(videoDuration, complexity) {
        return videoDuration * editingTime[complexity];
    }
    
    // Function to calculate team costs
    function calculateTeamCost(videoType, complexity) {
        let teamCost = 0;
        let team = [];
        
        if (videoType === 'planning-intensive') {
            team = (complexity === 'low') ? 
                [{ role: "coordinator", hours: 8 }, { role: "cinematographer", hours: 12 }, { role: "editor", hours: 24 }] :
                (complexity === 'medium') ? 
                [{ role: "coordinator", hours: 12 }, { role: "cinematographer", hours: 12 }, { role: "editor", hours: 32 }] :
                [{ role: "coordinator", hours: 20 }, { role: "cinematographer", hours: 12 }, { role: "editor", hours: 32 }, { role: "designer", hours: 16 }];
        } else if (videoType === 'production-heavy') {
            team = (complexity === 'low') ? 
                [{ role: "coordinator", hours: 12 }, { role: "cinematographer", hours: 12 }, { role: "editor", hours: 48 }] :
                (complexity === 'medium') ? 
                [{ role: "coordinator", hours: 24 }, { role: "cinematographer", hours: 24 }, { role: "editor", hours: 56 }] :
                [{ role: "coordinator", hours: 24 }, { role: "cinematographer", hours: 24 }, { role: "editor", hours: 36 }, { role: "designer", hours: 16 }];
        } else if (videoType === 'post-production-heavy') {
            team = (complexity === 'low') ? 
                [{ role: "editor", hours: 8 }, { role: "motionDesigner", hours: 20 }] :
                (complexity === 'medium') ? 
                [{ role: "editor", hours: 16 }, { role: "motionDesigner", hours: 40 }] :
                [{ role: "editor", hours: 20 }, { role: "motionDesigner", hours: 36 }, { role: "designer", hours: 16 }];
        }
        
        team.forEach(member => {
            teamCost += member.hours * hourlyRates[member.role];
        });
        
        return teamCost;
    }
    
    // Calculate Total Cost
    const studioCost = calculateStudioCost(videoDuration);
    const editingCost = calculateEditingTime(videoDuration, complexity) * hourlyRates.editor;
    const teamCost = calculateTeamCost(videoType, complexity);

    let totalCost = studioCost + editingCost + teamCost;

    // If client has base fee, adjust total cost
    if (clientBaseFee === 'yes') {
        totalCost *= 0.9; // Example: apply a 10% discount if base fee exists
    }

    // Output the result
    document.getElementById('totalCost').textContent = `Total Estimated Cost: R$ ${totalCost.toFixed(2)}`;
    document.getElementById('output').classList.remove('d-none');
});
