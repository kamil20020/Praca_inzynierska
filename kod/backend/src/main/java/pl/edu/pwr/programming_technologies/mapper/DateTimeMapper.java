package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Mapper
public interface DateTimeMapper {

    DateTimeMapper INSTANCE = Mappers.getMapper(DateTimeMapper.class);

    @Named("localDateTimeToOffsetDateTime")
    default OffsetDateTime localDateTimeToOffsetDateTime(LocalDateTime localDateTime){
        if(localDateTime == null)
            return null;
        ZoneId zoneId = ZoneId.systemDefault();
        return ZonedDateTime.of(localDateTime, zoneId).toOffsetDateTime();
    }

    @Named("offsetDateTimeToLocalDateTime")
    default LocalDateTime offsetDateTimeToLocalDateTime(OffsetDateTime offsetDateTime){
        if(offsetDateTime == null)
            return null;
        return offsetDateTime.toLocalDateTime();
    }
}
