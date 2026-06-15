        function toggleDia(checkbox) {
            const row = checkbox.closest('tr');
            const inputs = row.querySelectorAll('input[type="time"]');
            
            if (checkbox.checked) {
                // Modo Folga
                row.classList.add('opacity-60', 'grayscale', 'bg-gray-50', 'dark:bg-gray-800');
                row.classList.remove('hover:bg-gray-50/50', 'dark:hover:bg-gray-700/30');
                inputs.forEach(i => i.readOnly = true); 
            } else {
                // Modo Trabalho
                row.classList.remove('opacity-60', 'grayscale', 'bg-gray-50', 'dark:bg-gray-800');
                row.classList.add('hover:bg-gray-50/50', 'dark:hover:bg-gray-700/30');
                inputs.forEach(i => i.readOnly = false);
            }
        }