FROM golang:1.25-alpine AS builder

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /fish-market-api ./cmd/server

FROM alpine:3.22

WORKDIR /app

RUN apk add --no-cache ca-certificates tzdata

COPY --from=builder /fish-market-api /app/fish-market-api
COPY --from=builder /app/docs /app/docs

RUN mkdir -p /app/uploads/products

EXPOSE 8080

CMD ["/app/fish-market-api"]
