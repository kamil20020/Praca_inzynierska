package pl.edu.pwr.programming_technologies.mapper;

import org.bson.types.ObjectId;
import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface MongoObjectIDMapper {

    MongoObjectIDMapper INSTANCE = Mappers.getMapper(MongoObjectIDMapper.class);

    @Named("objectIdToHexString")
    default String objectIdToHexString(ObjectId objectId){
        if(objectId == null)
            return null;
        return objectId.toHexString();
    }

    @Named("hexStringToObjectId")
    default ObjectId hexStringToObjectId(String hexString){
        if(hexString == null)
            return null;
        return new ObjectId(hexString);
    }
}
