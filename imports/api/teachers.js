import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Teachers = new Mongo.Collection('teachers');
 
/** Eventualmente un cliente puede obtener acceso a este archivo ya que esta en imports.
algo como la publicación de datos deberia hacerse en un archivo como publications.js en la carpeta
server. De lo contrario un cliente podria modificar el código y acceder a cosas que uno no desea.
*/
if (Meteor.isServer) {
  // This code only runs on the server
    Meteor.publish('teachers', function teachersPublication() {
        return Teachers.find();
    });
}

// Deny all client-side updates on the Teachers collection, 
// just in case removing insecure and autopublish is not enough

/**Esto esta bien si exsten metodos en el lado del servidor que lo hagan, pero no los vi explicitos
entonces pasa lo mismo
**/
Teachers.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});

// For if User Management is added:
// Deny all client-side updates to user documents
//Meteor.users.deny({
//    update() { return true; }
//});
/**
De nuevo creo que los metodos deberian estar en la carpeta server en un archivo que se llame
metos.js
**/

Meteor.methods({
    'teachers.addReview'(teacher, review) {
        check(teacher, Object);

        // Redundant argument validation to ensure data integrity
        /**
        ¿Enserio toca pasar todo esto?
        Pero veo que solo esta usando como el ID del profesor y no más
        **/
        check(teacher, {
            _id: Meteor.Collection.ObjectID,
            profile_pic_url: String,
            name: String,
            copyright: String,
            avg_review: Number,
            occupation: String,
            studies: [{title: String}],
            classes_given: [{name: String}],
            reviews: [{
                criterias: [{selection: Number, description: String}],
                totalScore: Number,
                comments: String,
                createdAt: Date
            }],

        });

        // Check the arguments of the review to be of the expected data types
        check(review, Object);
        check(review, {
            criterias: [{selection: Number, description: String}],
            totalScore: Number,
            comments: String,
            createdAt: Date
        });

        let teacherToUpdate = Teachers.findOne({_id: teacher._id});

        if(JSON.stringify(teacher) == JSON.stringify(teacherToUpdate)){
            
            let numberOfReviews = teacherToUpdate.reviews.length;
            let newAverageScore = (review.totalScore + (teacherToUpdate.avg_review*numberOfReviews))/(numberOfReviews+1);

            Teachers.update(teacher._id, { $set: { avg_review: newAverageScore }, $push: { reviews: review } });
        }
        else{
            alert('Parameter teacher different from database one!');
            return;
        }
    },

    'teachers.deleteReview'(teacher, review) {
        check(teacher, Object);
        check(review, Object);

        let numberOfReviews = teacher.reviews.length;
        let newAverageScore = ((teacher.avg_review*numberOfReviews)-review.totalScore)/(numberOfReviews-1);

        Teachers.update(teacher._id, { $set: { avg_review: newAverageScore }, $pop: { reviews: review } });
    },
});