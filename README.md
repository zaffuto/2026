# Ecocupon.cl - Plataforma de Cupones Ecológicos

## Descripción
Ecocupon.cl es una plataforma web que permite a los usuarios gestionar y acceder a cupones ecológicos, promoviendo prácticas sostenibles y el cuidado del medio ambiente en Chile.

## Características Principales
- Autenticación de usuarios
- Gestión de cupones ecológicos
- Panel de administración
- Interfaz intuitiva y responsive

## Tecnologías Utilizadas
- React 18
- TypeScript
- Vite
- Supabase (Backend y Autenticación)

## Requisitos Previos
- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL del repositorio]
cd [nombre-del-proyecto]
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

## Desarrollo

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Construcción

Para generar la versión de producción:
```bash
npm run build
```

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes de React
  ├── contexts/       # Contextos de React
  ├── hooks/          # Hooks personalizados
  ├── lib/            # Configuraciones y utilidades
  ├── types/          # Definiciones de tipos TypeScript
  └── utils/          # Funciones utilitarias
```

## Hooks Personalizados

### useAuth
Maneja la autenticación de usuarios y el estado de la sesión.

### useCoupons
Gestiona la obtención y manipulación de cupones.

## Licencia
Este proyecto está bajo la Licencia MIT.

## Soporte
Para soporte o consultas, por favor crear un issue en el repositorio del proyecto.