"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Star, MapPin, Coffee, Heart, Globe, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type {
  Cafe,
  Image,
  Comment,
  User,
  Rating,
  Favorite,
} from "@prisma/client";

interface ExtendedCafe extends Cafe {
  images: Image[];
  comments: (Comment & {
    user: User;
  })[];
  ratings: Rating[];
  favorites: Favorite[];
}

export default function CafeDetailsPage() {
  const params = useParams();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [cafe, setCafe] = useState<ExtendedCafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchCafeDetails = async () => {
      try {
        const response = await fetch(`/api/cafes/${params.id}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setCafe(null);
        } else {
          setCafe(data);
          // Eğer kullanıcı girişi yapılmışsa, favorileri kontrol et
          if (session?.user && data.favorites) {
            setIsFavorite(
              data.favorites.some(
                (fav: Favorite) => fav.userId === session.user.id
              )
            );
          }
          // Kullanıcının mevcut değerlendirmesini kontrol et
          if (session?.user && data.ratings) {
            const userRating = data.ratings.find(
              (r: Rating) => r.userId === session.user.id
            );
            if (userRating) {
              setRating(userRating.rating);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching cafe details:", error);
        setError("Kafe bilgileri yüklenirken bir hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCafeDetails();
    }
  }, [params.id, session]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum yapmak için giriş yapmalısınız.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/cafes/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: data.error,
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Yorumunuz başarıyla eklendi.",
        });
        setComment("");
        // Refresh comments
        const updatedCafe = await (
          await fetch(`/api/cafes/${params.id}`)
        ).json();
        setCafe(updatedCafe);
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Yorum gönderilirken bir hata oluştu.",
      });
    }
  };

  const handleRating = async (value: number) => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Değerlendirme yapmak için giriş yapmalısınız.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/cafes/${params.id}/ratings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: value }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: data.error,
        });
      } else {
        toast({
          title: "Başarılı",
          description: "Değerlendirmeniz kaydedildi.",
        });
        setRating(value);
        const updatedCafe = await (
          await fetch(`/api/cafes/${params.id}`)
        ).json();
        setCafe(updatedCafe);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Değerlendirme kaydedilirken bir hata oluştu.",
      });
    }
  };

  const toggleFavorite = async () => {
    if (!session) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Favorilere eklemek için giriş yapmalısınız.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/cafes/${params.id}/favorites`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: data.error,
        });
      } else {
        setIsFavorite(!isFavorite);
        toast({
          title: "Başarılı",
          description: isFavorite
            ? "Favorilerden kaldırıldı."
            : "Favorilere eklendi.",
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İşlem gerçekleştirilirken bir hata oluştu.",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-24">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cafe) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 mt-24">
        <Coffee className="w-16 h-16 text-[#6B4423] mb-4" />
        <h2 className="text-2xl font-semibold text-[#6B4423] mb-2 text-center">
          Bir Hata Oluştu
        </h2>
        <p className="text-lg text-[#8B5E34] text-center">{error}</p>
      </div>
    );
  }

  const averageRating = cafe.ratings.length
    ? cafe.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
      cafe.ratings.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8 mt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#6B4423]">{cafe.name}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-1" />
            <span>{averageRating.toFixed(1)}</span>
          </div>
          <Button
            variant={isFavorite ? "secondary" : "outline"}
            onClick={toggleFavorite}
            disabled={!session}
          >
            <Heart
              className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`}
            />
            {isFavorite ? "Favorilerde" : "Favorilere Ekle"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <Card>
            <div className="relative h-64 w-full">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={true}
                pagination={{ clickable: true }}
                slidesPerView={1}
                className="w-full h-full"
              >
                {cafe.images.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div className="h-64 w-full">
                      <img
                        src={image.url}
                        alt={cafe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kafe Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cafe.description && (
                <p className="text-gray-600">{cafe.description}</p>
              )}
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#6B4423]" />
                <p>
                  {cafe.city}, {cafe.district}
                </p>
              </div>
              {cafe.googleMapsUrl && (
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-[#6B4423]" />
                  <a
                    href={cafe.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Haritada Görüntüle
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {cafe.googleMapsEmbedUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Konum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <iframe
                    src={cafe.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Değerlendirme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    variant={value <= rating ? "default" : "outline"}
                    onClick={() => handleRating(value)}
                    disabled={!session}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        value <= rating ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Yorumlar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <Textarea
              placeholder={
                session
                  ? "Yorumunuzu yazın..."
                  : "Yorum yapmak için giriş yapmalısınız"
              }
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mb-4"
              disabled={!session}
            />
            <Button type="submit" disabled={!session}>
              {!session && <LogIn className="mr-2" size={20} />}
              {session ? "Yorum Yap" : "Yorum yapmak için giriş yapın"}
            </Button>
          </form>

          <div className="space-y-4">
            {cafe.comments.map((comment) => (
              <div
                key={comment.id}
                className="flex space-x-4 p-4 bg-gray-50 rounded-lg"
              >
                <Avatar>
                  <AvatarImage src={comment.user.profileImage || undefined} />
                  <AvatarFallback>{comment.user.name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{comment.user.name}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
