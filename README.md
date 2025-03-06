# 🌍 Star Wars & Rick and Morty API - Serverless AWS Lambda

Este proyecto es una API **Serverless** desarrollada con **Node.js, AWS Lambda y DynamoDB**, que combina datos de **Star
Wars (SWAPI)** y **Rick and Morty API**, relacionando los planetas de los personajes, si no lo encuentra, le asigna uno
aleatorio.

---

## 🚀 **Despliegue en AWS**

**Base URL:**

```
https://w5o5d0otyf.execute-api.us-east-1.amazonaws.com/dev
```

---

## 📌 **Endpoints Disponibles**

### 1️⃣ **Obtener Datos Fusionados (`GET /fusion/{id}`)**

**Descripción:** Obtiene información de un personaje de **Star Wars** (basado en `id`) y busca un planeta relacionado en
**Rick and Morty**.

🔹 **URL:**

```
GET /fusion/{id}
```

🔹 **Ejemplo de uso (Luke Skywalker - ID `1`)**:

```bash
curl https://w5o5d0otyf.execute-api.us-east-1.amazonaws.com/dev/fusion/1
```

🔹 **Ejemplo de respuesta (JSON)**

```json
{
  "starWars": {
    "name": "Luke Skywalker",
    "homeworld": "Tatooine",
    "climate": "arid",
    "terrain": "desert"
  },
  "relatedRickAndMortyLocation": {
    "name": "Citadel of Ricks",
    "type": "Space station",
    "dimension": "Unknown"
  }
}
```

---

### 2️⃣ **Guardar Datos Personalizados (`POST /store`)**

**Descripción:** Permite almacenar información personalizada en **DynamoDB**.

🔹 **URL:**

```
POST /store
```

🔹 **Ejemplo de uso (guardar datos personalizados)**:

```bash
curl -X POST https://w5o5d0otyf.execute-api.us-east-1.amazonaws.com/dev/store \
  -H "Content-Type: application/json" \
  -d '{"name": "Darth Vader", "side": "Dark"}'
```

🔹 **Ejemplo de respuesta (JSON)**

```json
{
  "message": "Data stored successfully!",
  "data": {
    "name": "Darth Vader",
    "side": "Dark"
  }
}
```

---

### 3️⃣ **Obtener Historial de Datos (`GET /history`)**

**Descripción:** Retorna todo el historial de datos almacenados en **DynamoDB**.

🔹 **URL:**

```
GET /history
```

🔹 **Ejemplo de uso:**

```bash
curl https://w5o5d0otyf.execute-api.us-east-1.amazonaws.com/dev/history
```

🔹 **Ejemplo de respuesta (JSON)**

```json
[
  {
    "id": "1710000000000",
    "name": "Darth Vader",
    "side": "Dark"
  }
]
```

---

## 🛠 **Tecnologías Usadas**

✅ **Node.js** (TypeScript)  
✅ **AWS Lambda** (Ejecución sin servidores)  
✅ **DynamoDB** (Base de datos NoSQL)  
✅ **Serverless Framework** (Despliegue en AWS)  
✅ **Axios** (Consumo de APIs externas)

---

## ⚙️ **Configuración del Proyecto**

### **1. Clonar el Repositorio**

```bash
git clone https://github.com/davichano/NodeServerlessTest.git
cd NodeServerlessTest
```

### **2. Instalar Dependencias**

```bash
npm install
```

### **3. Configurar Variables de Entorno**

Crear un archivo `.env` con el siguiente contenido:

```
AWS_ACCESS_KEY_ID=TU_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=TU_SECRET_KEY
AWS_REGION=us-east-1

SWAPI_URL=https://swapi.dev/api
RICKANDMORTY_URL=https://rickandmortyapi.com/api
```

### **4. Ejecutar en Local**

```bash
serverless offline
```

### **5. Ejecutar las Pruebas**

Para ejecutar las pruebas unitarias, usa:

```bash
npm test
```

### **6. Desplegar en AWS**

```bash
serverless deploy
```

---
