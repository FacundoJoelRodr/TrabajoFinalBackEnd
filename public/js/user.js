(function () {
    async function removeUser(uid) {
      try {
        const response = await fetch(`/api/users/${uid}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        const tableRow = document.querySelector(`tr[data-user-id="${uid}"]`);
        if (tableRow) {
          tableRow.remove();
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
      }
    }
  
    async function updateUser(uid, newData) {
      try {
        const response = await fetch(`/api/user/${uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
        location.reload()
        // Aquí podrías refrescar la tabla o actualizar la fila correspondiente en la interfaz
      } catch (error) {
        console.error('Error al actualizar usuario:', error.message);
      }
    }

    function isEqual(value1, value2) {
        return value1 === value2;
      }
  
    document.addEventListener('DOMContentLoaded', () => {
      const removeButtons = document.querySelectorAll('.remove-user');
      removeButtons.forEach((button) => {
        button.addEventListener('click', async (event) => {
          const userId = event.target.dataset.userId;
          console.log(userId,"userid");
          await removeUser(userId);
        });
      });
  
      const selectElements = document.querySelectorAll('.user-role');
      selectElements.forEach((select) => {
        select.addEventListener('change', async (event) => {
          const userId = event.target.dataset.userId;
          const newRole = event.target.value;
          const newData = { role: newRole };
          console.log(userId,"userid");
          console.log(newData,"newData");
          console.log(newRole,"newRole");
          await updateUser(userId, newData);
        });
      });
    });
  })();
  