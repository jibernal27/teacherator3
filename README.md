Es bueno que el cliente nunca importa algo que el servidor también, sin embargo
si por algun motivo lo hiciese le estaria dando acceso a cosas que solo el servidor deberia saber.
Por eso mi consejo es que en import solo deje las cosas que no se cargan siempre, por ejemplo la vista del detalle de algo y en server ponga los metodos y los permisos. Tampoco veo pruebas unitarias no de metodos como dijo Jhon que tocaba hacer. 

# teacherator3

## Installation

Clone this repository, then run:

    $ meteor npm install

This will install NPM packages and update the Meteor packages used in the project.

To initialize the app run:

    $ meteor
