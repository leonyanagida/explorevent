import Event, { IEvent } from "../models/event-model";
import { IUser } from "../models/user-model";

interface ICreateEventInput {
  eventAddress: IEvent["eventAddress"];
  eventCity: IEvent["eventCity"];
  eventState: IEvent["eventState"];
  eventZip: IEvent["eventZip"];
  eventStartDate: IEvent["eventStartDate"];
  eventEndDate: IEvent["eventEndDate"];
  eventStartTime: IEvent["eventStartTime"];
  eventEndTime: IEvent["eventEndTime"];
  online: IEvent["online"];
  eventName: IEvent["eventName"];
  creatorId: IUser["_id"];
  text: IEvent["text"];
}

async function CreateNewEvent({
  eventAddress,
  eventCity,
  eventState,
  eventZip,
  eventStartDate,
  eventEndDate,
  eventStartTime,
  eventEndTime,
  eventName,
  creatorId,
  online,
  text,
}: ICreateEventInput): Promise<IEvent> {
  return new Promise((resolve, reject) => {
    try {
      Event.create({
        eventAddress: eventAddress,
        eventCity: eventCity,
        eventState: eventState,
        eventZip: eventZip,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        eventStartTime: eventStartTime,
        eventEndTime: eventEndTime,
        online: online,
        creatorId: creatorId,
        eventComments: [],
        eventDate: [], // Front-end => every weekend / every day / => make sure to convert
        eventHours: [],
        eventImg: "",
        eventLikes: [],
        eventName: eventName,
        exclusive: false,
        published: true,
        text: text,
        usersAttending: [],
      }).then((data: IEvent) => {
        return resolve(data);
      });
    } catch (err) {
      return reject(new Error("Error creating new event"));
    }
  });
}

async function EditEventById({
  eventDate,
  eventHours,
  eventId,
  eventAddress,
  eventCity,
  eventState,
  eventZip,
  eventStartDate,
  eventEndDate,
  eventStartTime,
  eventEndTime,
  eventName,
  online,
  text,
}: {
  eventDate: object;
  eventHours: object;
  eventId: string;
  eventAddress: string;
  eventCity: string;
  eventState: string;
  eventZip: string;
  eventStartDate: string;
  eventEndDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventName: string;
  online: boolean;
  text: string;
}): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    try {
      Event.findByIdAndUpdate(eventId, {
        eventDate: [eventDate],
        eventHours: [eventHours],
        eventId: eventId,
        eventAddress: eventAddress,
        eventCity: eventCity,
        eventState: eventState,
        eventZip: eventZip,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        eventStartTime: eventStartTime,
        eventEndTime: eventEndTime,
        eventName: eventName,
        online: online,
        text: text,
      }).exec((err, res) => {
        if (err) {
          reject(err);
        } else {
          if (res) {
            resolve(res);
          } else {
            resolve(null);
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function EditEventImg({
  eventId,
  eventImg,
}: {
  eventId: string;
  eventImg: string;
}): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    try {
      Event.findByIdAndUpdate(eventId, {
        eventImg: eventImg,
      }).exec((err, res) => {
        if (err) {
          reject(err);
        } else {
          if (res) {
            resolve(res);
          } else {
            resolve(null);
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function DeleteEventImg({
  eventId,
}: {
  eventId: string;
}): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    try {
      Event.findByIdAndUpdate(eventId, {
        eventImg: "",
      }).exec((err, res) => {
        if (err) {
          reject(err);
        } else {
          if (res) {
            resolve(res);
          } else {
            resolve(null);
          }
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

async function FindEventNameSearch(search: string) {
  return new Promise((resolve, reject) => {
    // Find the event that are similar to the search text using regex
    const escapeRegExp = search.replace(
      /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
      "\\$&"
    );
    const searchEvent = new RegExp(escapeRegExp, "i");
    // When searching events, we will return all items that match the eventname or eventCity
    Event.find({
      $or: [{ eventName: searchEvent }, { eventCity: searchEvent }],
    })
      .limit(100)
      .exec((err, res) => {
        if (err) {
          reject(err);
        } else {
          if (res) {
            resolve(res);
          } else {
            resolve([]);
          }
        }
      });
  });
}

async function FindEventById(id: string): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    try {
      Event.findById(id)
        .populate({
          path: "eventComments",
          populate: {
            path: "creatorId",
            select: "username",
          },
        })
        // We are returning the attendingEvents to determine if the user is attending/liked an event
        .populate("creatorId", "_id about username attendingEvents likedEvents")
        .limit(1)
        .exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res) {
              resolve(res);
            } else {
              resolve(null);
            }
          }
        });
    } catch (err) {
      reject(err);
    }
  });
}

async function FindAllEvents() {
  return new Promise((resolve, reject) => {
    try {
      Event.find()
        .sort({ createdAt: -1 })
        .populate("creatorId", "username")
        .exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res) {
              resolve(res);
            } else {
              resolve(null);
            }
          }
        });
    } catch (err) {
      reject(err);
    }
  });
}

async function DeleteEvent({
  eventId,
}: {
  eventId: string;
}): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    Event.findByIdAndDelete(eventId).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res) {
          resolve(res);
        } else {
          resolve(null);
        }
      }
    });
  });
}

async function DeleteAllUserEventsById(userId: string): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    Event.updateMany(
      { creatorId: userId },
      {
        eventComments: [],
        eventLikes: [],
        eventName: "[Event has been deleted]",
        exclusive: false,
        published: false,
        text: "[deleted]",
        usersAttending: [],
      }
    ).exec((err, res) => {
      if (err) {
        reject(err);
      } else {
        if (res) {
          resolve(res);
        } else {
          resolve(null);
        }
      }
    });
  });
}

async function DeleteEventComment({
  commentId,
  eventId,
}: {
  commentId: string;
  eventId: string;
}) {
  return new Promise((resolve, reject) => {
    Event.findById(eventId, (err, event) => {
      let eventArr = event?.eventComments;
      // Remove the commentId from the eventArr
      for (let i = eventArr.length - 1; i >= 0; --i) {
        if (eventArr[i] == commentId) {
          eventArr.splice(i, 1);
        }
      }
      Event.findByIdAndUpdate(eventId, { eventComments: eventArr }).exec(
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res) {
              resolve(res);
            } else {
              resolve(null);
            }
          }
        }
      );
    });
  });
}

async function ToggleEventAttend({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    Event.findById(eventId, (err, event) => {
      // Check if the usersAttending array contains the user that is toggling the attend/unattend button
      if (event?.usersAttending.includes(userId)) {
        // If the userId is already in the array, filter and remove the user to "unattend" the user from the event
        const filterUsersAttending = event?.usersAttending.filter((id: any) => {
          return id != userId;
        });
        // Set the new array with the removed userId
        Event.findByIdAndUpdate(eventId, {
          usersAttending: filterUsersAttending,
        }).exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res) {
              resolve(res);
            } else {
              resolve(null);
            }
          }
        });
      } else {
        Event.findByIdAndUpdate(eventId, {
          usersAttending: [...event?.usersAttending, userId],
        }).exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res) {
              resolve(res);
            } else {
              resolve(null);
            }
          }
        });
      }
    });
  });
}

async function ToggleEventLike({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    Event.findById(eventId, { eventLikes: userId }, (err, event) => {
      if (event?.eventLikes.includes(userId)) {
        // If the userId is already in the array, filter and remove the user to "unattend" the user from the event
        const filterEventLikes = event?.eventLikes.filter((id: any) => {
          return id != userId;
        });
        // Set the new array with the removed userId
        Event.findByIdAndUpdate(eventId, { eventLikes: filterEventLikes }).exec(
          (err, res) => {
            if (err) {
              reject(err);
            } else {
              if (res) {
                resolve(res);
              } else {
                resolve(null);
              }
            }
          }
        );
      } else {
        Event.findByIdAndUpdate(eventId, {
          eventLikes: [...event?.eventLikes, userId],
        }).exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res) {
              resolve(res);
            } else {
              resolve(null);
            }
          }
        });
      }
    });
  });
}

async function UpdateEventCreateComment({
  eventId,
  commentId,
}: {
  eventId: string;
  commentId: string;
}): Promise<IEvent | null> {
  return new Promise((resolve, reject) => {
    try {
      Event.findById(eventId).then((findEvent) => {
        Event.findByIdAndUpdate(eventId, {
          eventComments: [...findEvent?.eventComments, commentId],
        }).exec((err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res) {
              resolve(res);
            } else {
              resolve(null);
            }
          }
        });
      });
    } catch (err) {
      reject(err);
    }
  });
}

export default {
  CreateNewEvent,
  DeleteAllUserEventsById,
  DeleteEvent,
  DeleteEventComment,
  DeleteEventImg,
  EditEventById,
  EditEventImg,
  FindAllEvents,
  FindEventById,
  FindEventNameSearch,
  ToggleEventAttend,
  ToggleEventLike,
  UpdateEventCreateComment,
};
