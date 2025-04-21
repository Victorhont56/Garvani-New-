// src/components/common/ListingCard.tsx
import { Link } from "react-router-dom";
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmitButtons";
import { ListingCardProps } from "@/types/profile";
import { TbCurrencyNaira } from "react-icons/tb";

export function ListingCard({
  item,
  userId,
  pathName
}: {
  item: ListingCardProps;
  userId: string;
  pathName: string;
}) {
  const { id, state, lga, mode, title, price, favorites, photo } = item;
  const favorite = favorites.find(fav => fav.user_id === userId);
  const isInFavoriteList = !!favorite;

  return (
    <div>
    <Link to={`/listing/${id}`} className="mt-2">
      <div className="items-center justify-center w-[270px] flex flex-col bg-[#efe7f6] rounded-2xl hover:border-[3px] hover:border-gray-300 hover:shadow-2xl shadow:xl md:shadow-none lg:shadow:none transition duration-300 ease-in-out">
        <div className="flex flex-col items-center justify-center">
          <div className="my-[10px]">
            <div className="w-[250px] flex flex-row items-center justify-between">
              <h3 className="font-medium text-gray-700">
                For {mode}
              </h3>
              <div >
                <p className="flex flex-row text-muted-foreground">
                  <span className="font-medium text-black flex flex-row items-center"><TbCurrencyNaira size={20}/> {price}</span>
                  <span className="text-gray-700">/Month</span>
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-2 text-gray-700">
              {title}
            </p>
          </div>

          <div className="relative h-[200px] w-[250px]">
            <div>
              <img
                src={photo || ''}
                alt="Image of House"
                className="rounded-lg h-[200px] w-[300px] object-cover"
              />

              {userId && (
                <div className="z-10 absolute top-2 right-2">
                  {isInFavoriteList ? (
                    <form>
                      <input type="hidden" name="favoriteId" value={favorite.id} />
                      <input type="hidden" name="userId" value={userId} />
                      <input type="hidden" name="pathName" value={pathName} />
                      <DeleteFromFavoriteButton />
                    </form>
                  ) : (
                    <form>
                      <input type="hidden" name="homeId" value={id} />
                      <input type="hidden" name="userId" value={userId} />
                      <input type="hidden" name="pathName" value={pathName} />
                      <AddToFavoriteButton />
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="my-[10px]">
            <div className="flex justify-between w-[250px]">
                <div className="flex flex-col items-center justify-center"> 
                  <h3 className="font-medium text-gray-700">State</h3>
                   <h3 className="font-medium text-base">{state}</h3>
                </div>  
                <div className="flex flex-col items-center justify-center">  
                  <h3 className="font-medium text-gray-700">LGA</h3>
                  <h3 className="font-medium text-base">{lga}</h3>
                </div>  
            </div>
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
}